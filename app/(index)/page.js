"use client";

import * as THREE from "three";
import { animated, useSpring } from "@react-spring/three";
import { Canvas, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

import Debug from "./Debug";
import Poster, { POSTER_SIZE, POSTER_DISTANCE } from "./Poster";

const DEBUG = false;

const Scene = () => {
  const posters = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(1, 0, 1),
    new THREE.Vector3(0, 1, 1),
  ];

  const posterGroupY = 0.25;

  const scrollBoundsFactor = Math.ceil(posters.length / 2) * POSTER_DISTANCE;
  const scrollBounds = [-scrollBoundsFactor, scrollBoundsFactor];

  const { viewport } = useThree();
  const [spring, api] = useSpring(() => ({ position: [0, posterGroupY, 0] }));
  useDrag(
    ({ offset: [offsetX], last }) => {
      api.set({ position: [offsetX, posterGroupY, 0] });

      if (last) {
        const snappingPoint =
          POSTER_DISTANCE * Math.round(offsetX / POSTER_DISTANCE);
        api.start({ position: [snappingPoint, posterGroupY, 0] });
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
            key={[poster.x, poster.y, poster.z]}
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
          posterGroupY={posterGroupY}
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
