const Debug = ({
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
        <mesh key={x} position={[x, 0, -0.01]}>
          <planeGeometry args={[posterSize.width, posterSize.height]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      ))}
    </>
  );
};

export default Debug;
