"use client";

import { animated, useSpring } from "@react-spring/three";
import { Canvas, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

import Debug from "./Debug";

const DEBUG = false;

const POSTER_SIZE = { width: 1, height: 1 };
const POSTER_SPACING = 1;
const POSTER_DISTANCE = POSTER_SIZE.width + POSTER_SPACING;

const Poster = ({
  initialPosition,
  color,
  scrollBounds: [leftScrollBound, rightScrollBound],
}) => {
  const { viewport } = useThree();
  const [spring, api] = useSpring(() => ({ position: initialPosition }));
  useDrag(
    ({
      movement: [movementX],
      first,
      memo = { dragStart: 0, movementOffset: 0 },
    }) => {
      if (first) {
        const [currentX] = spring.position.get();
        return { dragStart: currentX, movementOffset: 0 };
      }
      const updatedX = memo.dragStart + movementX + memo.movementOffset;
      api.start({ position: [updatedX, 0, 0] });

      if (updatedX < leftScrollBound) {
        api.set({ position: [rightScrollBound, 0, 0] });
        return { dragStart: rightScrollBound, movementOffset: -1 * movementX };
      }
      if (updatedX > rightScrollBound) {
        api.set({ position: [leftScrollBound, 0, 0] });
        return { dragStart: leftScrollBound, movementOffset: -1 * movementX };
      }
    },
    {
      target: window.document,
      transform: ([x, y]) => [x / viewport.factor, y / viewport.factor],
    }
  );

  return (
    <animated.mesh {...spring}>
      <planeGeometry args={[POSTER_SIZE.width, POSTER_SIZE.height]} />
      <meshStandardMaterial color={color} />
    </animated.mesh>
  );
};

const Scene = () => {
  const posters = ["orange", "blue"];
  const postersStart = -Math.floor(posters.length / 2) * POSTER_DISTANCE;

  const scrollBoundsFactor = Math.ceil(posters.length / 2) * POSTER_DISTANCE;
  const scrollBounds = [-scrollBoundsFactor, scrollBoundsFactor];

  return (
    <>
      <ambientLight />
      {posters.map((poster, i) => (
        <Poster
          key={poster}
          initialPosition={[postersStart + i * POSTER_DISTANCE, 0, 0]}
          color={poster}
          scrollBounds={scrollBounds}
        />
      ))}

      {DEBUG && (
        <Debug
          posterSize={POSTER_SIZE}
          posterDistance={POSTER_DISTANCE}
          scrollBounds={scrollBounds}
        />
      )}
    </>
  );
};

const Home = () => {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  );
};

export default Home;
