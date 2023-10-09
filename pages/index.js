import { animated, useSpring } from "@react-spring/three";
import { Canvas, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

const POSTER_SIZE = { width: 1, height: 1 };
const POSTER_SPACING = 1;
const POSTER_DISTANCE = POSTER_SIZE.width + POSTER_SPACING;

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
      <planeGeometry args={[POSTER_SIZE.width, POSTER_SIZE.height]} />
      <meshStandardMaterial color={color} />
    </animated.mesh>
  );
};

const Scene = () => {
  const posters = ["orange", "blue"];
  const postersStart = -Math.floor(posters.length / 2) * POSTER_DISTANCE;

  return (
    <>
      <ambientLight />
      {posters.map((poster, i) => (
        <Poster
          key={poster}
          initialPosition={[postersStart + i * POSTER_DISTANCE, 0, 0]}
          color={poster}
        />
      ))}
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
