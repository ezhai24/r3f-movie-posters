import { animated, useSpring } from "@react-spring/three";
import { Canvas, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

const Scene = () => {
  const { viewport } = useThree();
  const [spring, api] = useSpring(() => ({ position: [0, 0, 0] }));
  useDrag(
    ({ offset: [offsetX] }) => {
      api.start({ position: [offsetX, 0, 0] });
    },
    {
      target: window.document,
      transform: ([x, y]) => [x / viewport.factor, y / viewport.factor],
    }
  );

  return (
    <>
      <ambientLight />
      <animated.mesh {...spring}>
        <planeGeometry />
        <meshStandardMaterial />
      </animated.mesh>
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
