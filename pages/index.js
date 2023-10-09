import { animated, useSpring } from "@react-spring/three";
import { Canvas, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

const Poster = ({ initialPosition, color }) => {
  const { viewport } = useThree();
  const [spring, api] = useSpring(() => ({ position: initialPosition }));
  useDrag(
    ({ movement: [movementX], first, memo = { dragStart: 0 } }) => {
      if (first) {
        const [currentX] = spring.position.get();
        return { dragStart: currentX };
      }
      const updatedX = memo.dragStart + movementX;
      api.start({ position: [updatedX, 0, 0] });
    },
    {
      target: window.document,
      transform: ([x, y]) => [x / viewport.factor, y / viewport.factor],
    }
  );

  return (
    <animated.mesh {...spring}>
      <planeGeometry />
      <meshStandardMaterial color={color} />
    </animated.mesh>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight />

      <Poster initialPosition={[-2, 0, 0]} color="orange" />
      <Poster initialPosition={[0, 0, 0]} color="blue" />
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
