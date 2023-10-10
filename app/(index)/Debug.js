import "./Poster/shader";

const Debug = ({
  posterGroupY = 0,
  posterSize,
  posterDistance,
  scrollBounds: [leftScrollBound, rightScrollBound],
}) => {
  const debugPosterPositions = [];
  for (let i = leftScrollBound; i <= rightScrollBound; i += posterDistance) {
    debugPosterPositions.push(i);
  }
  return (
    <>
      {debugPosterPositions.map((x) => (
        <mesh key={x} position={[x, posterGroupY, -0.01]}>
          <planeGeometry args={[posterSize.width, posterSize.height]} />
          <posterMaterial />
        </mesh>
      ))}
    </>
  );
};

export default Debug;
