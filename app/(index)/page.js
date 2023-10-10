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
    "./posters/parent-trap.jpeg",
    "./posters/barbie.jpeg",
    "./posters/alita.jpeg",
    "./posters/every.jpeg",
    "./posters/platform.jpg",
    "./posters/nysm.jpg",
  ];

  const posterGroupY = 0.25;

  const scrollBoundsFactor = Math.ceil(posters.length / 2) * POSTER_DISTANCE;
  const scrollBounds = [-scrollBoundsFactor, scrollBoundsFactor];

  const { viewport } = useThree();
  const [spring, api] = useSpring(() => ({ position: [0, posterGroupY, 0] }));
  useDrag(
    ({ offset: [offsetX] }) => {
      api.set({ position: [offsetX, posterGroupY, 0] });
    },
    {
      target: window.document,
      transform: ([x, y]) => [x / viewport.factor, y / viewport.factor],
    }
  );

  return (
    <>
      <animated.group {...spring}>
        {posters.map((poster, i) => (
          <Poster
            key={poster}
            posterUrl={poster}
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
    <Canvas style={{ backgroundColor: "#F5F0EE", touchAction: "none" }} linear>
      <Scene />
    </Canvas>
  );
};

export default Home;
