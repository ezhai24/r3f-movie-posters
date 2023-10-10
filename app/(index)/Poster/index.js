import { animated, useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

import "./shader";

export const POSTER_SIZE = { width: 3.75, height: 5 };
export const POSTER_SPACING = 1;
export const POSTER_DISTANCE = POSTER_SIZE.width + POSTER_SPACING;

export const Poster = ({
  color,
  initialX,
  postersGroupWidth,
  scrollBounds: [leftScrollBound, rightScrollBound],
}) => {
  const { viewport } = useThree();
  const [spring, api] = useSpring(() => ({
    position: [initialX, 0, 0],
  }));
  useDrag(
    ({ offset: [offsetX] }) => {
      const posterX = offsetX + spring.position.get()[0];

      // If the poster is within the scroll bounds, no adjustments
      // need to be made. We maintain the offset it has from the
      // poster group center's position.
      if (leftScrollBound <= posterX && posterX <= rightScrollBound) {
        return;
      }

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
      // - The position of the poster with no adjustments = the
      //   position of the poster group center + the distance
      //   between the poster group center and the poster
      //   = offsetX + initialX
      // - Minus the distance between the screen center and the bound
      // - Divided by the poster group's width (pGW)
      // - Rounded to the next upper number (ie. -1.2 -> -2, 1.2 -> 2).
      //   This means ceiling for positive numbers and flooring for
      //   negative numbers.
      const numCrosses =
        posterX > rightScrollBound
          ? Math.ceil(
              (offsetX + initialX - rightScrollBound) / postersGroupWidth
            )
          : Math.floor(
              (offsetX + initialX - leftScrollBound) / postersGroupWidth
            );

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
      //   and the poster (initialX)
      api.set({
        position: [postersGroupWidth * numCrosses * -1 + initialX, 0, 0],
      });
    },
    {
      target: window.document,
      transform: ([x, y]) => [x / viewport.factor, y / viewport.factor],
    }
  );

  return (
    <animated.mesh {...spring}>
      <planeGeometry args={[POSTER_SIZE.width, POSTER_SIZE.height, 64, 64]} />
      <posterMaterial uColor={color} />
    </animated.mesh>
  );
};

export default Poster;
