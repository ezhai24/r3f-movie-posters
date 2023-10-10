import * as THREE from "three";

import { animated, useSpring } from "@react-spring/three";
import { useThree, useLoader } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

import "./shader";

export const POSTER_SIZE = { width: 3.5, height: 5 };
export const POSTER_SPACING = 0.9;
export const POSTER_DISTANCE = POSTER_SIZE.width + POSTER_SPACING;

export const Poster = ({
  posterUrl,
  initialX,
  postersGroupWidth,
  scrollBounds: [leftScrollBound, rightScrollBound],
}) => {
  const [posterImage] = useLoader(THREE.TextureLoader, [posterUrl]);

  const { viewport } = useThree();
  const [spring, api] = useSpring(() => ({
    position: [initialX, 0, 0],
  }));
  useDrag(
    ({ offset: [posterGroupX], active }) => {
      // The position of this spring is the poster's
      // offset from the poster group's center
      const [offsetX] = spring.position.get();
      const posterX = posterGroupX + offsetX;

      // Calculate the number of times the poster has crossed a
      // scroll bound.
      //
      // This number of crosses can also be thought of as the
      // number of times the poster has traversed the poster
      // group's width (pGW) after crossing either the
      // rightScrollBound (rSB) or the leftScrollBound (lSB):
      //     |<---2--->|<---1--->|<--0-->|<---1--->|<---2--->|
      // lSB-2*pGW  lSB-pgW     lSB  0  rSB     lSB+pGW  lSB+2*pgW
      //
      // Numerically we can calculate this as:
      // - The position of the poster with no adjustments = posterX
      // - Minus the distance between the screen center and the
      //   respective bound (lSB or rSB)
      // - Divided by the poster group's width (pGW)
      // - Rounded to the next upper number (ie. -1.2 -> -2, 1.2 -> 2).
      //   This means ceiling for positive numbers and flooring for
      //   negative numbers.
      const numCrosses =
        posterX > rightScrollBound
          ? Math.ceil((posterX - rightScrollBound) / postersGroupWidth)
          : Math.floor((posterX - leftScrollBound) / postersGroupWidth);

      // Adjust the position of the poster in relation to the poster
      // group center's position.
      //
      // We can calculate the adjustment as:
      // - The poster group's width * the number of times the poster
      //   has crossed the left/right scroll bound.
      // - A negative numCrosses indicates we have crossed the left
      //   scroll bound numCrosses times. In this case, we want to
      //   adjust the poster to the far right. Similarly, a positive
      //   numCrosses indicates crosses of the right bound and
      //   necessitates an adjustment to the far left. Multiply by
      //   -1 to account for this inversion.
      // - Offset by the distance between the poster group center
      //   and the poster (offsetX)
      api.set({
        position: [postersGroupWidth * numCrosses * -1 + offsetX, 0, 0],
      });

      if (!active) {
        const snappingPoint =
          POSTER_DISTANCE * Math.round(posterX / POSTER_DISTANCE);
        const snappingOffset = posterX - snappingPoint;

        api.start({ position: [offsetX - snappingOffset, 0, 0] });
      }
    },
    {
      target: window.document,
      transform: ([x, y]) => [x / viewport.factor, y / viewport.factor],
    }
  );

  return (
    <animated.mesh {...spring}>
      <planeGeometry args={[POSTER_SIZE.width, POSTER_SIZE.height, 64, 64]} />
      <posterMaterial uTexture={posterImage} />
    </animated.mesh>
  );
};

export default Poster;
