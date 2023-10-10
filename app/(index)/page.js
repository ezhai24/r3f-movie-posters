"use client";

import { animated, useSpring } from "@react-spring/three";
import { Canvas, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

import Debug from "./Debug";
import Poster, { POSTER_SIZE, POSTER_DISTANCE } from "./Poster";

const DEBUG = false;

const Scene = () => {
  const posters = ["orange", "blue", "pink", "green"];

  const scrollBoundsFactor = Math.ceil(posters.length / 2) * POSTER_DISTANCE;
  const scrollBounds = [-scrollBoundsFactor, scrollBoundsFactor];

  const { viewport } = useThree();
  const [spring, api] = useSpring(() => ({ position: [0, 0, 0] }));
  useDrag(
    ({ offset: [offsetX], last }) => {
      api.set({ position: [offsetX, 0, 0] });

      if (last) {
        const snappingPoint =
          POSTER_DISTANCE * Math.round(offsetX / POSTER_DISTANCE);
        api.start({ position: [snappingPoint, 0, 0] });
      }
    },
    {
      target: window.document,
      transform: ([x, y]) => [x / viewport.factor, y / viewport.factor],
    }
  );

  return (
    <>
      <ambientLight />
      <animated.group {...spring}>
        {posters.map((poster, i) => (
          <Poster
            key={poster}
            color={poster}
            initialX={
              -Math.floor(posters.length / 2) * POSTER_DISTANCE +
              i * POSTER_DISTANCE
            }
            postersGroupWidth={posters.length * POSTER_DISTANCE}
            scrollBounds={scrollBounds}
          />
        ))}
      </animated.group>

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
    <Canvas style={{ touchAction: "none" }}>
      <Scene />
    </Canvas>
  );
};

export default Home;
