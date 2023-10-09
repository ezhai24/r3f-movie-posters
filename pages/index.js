import { Canvas } from "@react-three/fiber";

const Home = () => {
  return (
    <Canvas>
      <ambientLight />
      <mesh>
        <planeGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  );
};

export default Home;
