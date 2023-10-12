import * as THREE from "three";
import { useRef } from "react";
import { useFBO } from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";

import "./shaders/bloomShader";
import "./shaders/blurShader";
import "./shaders/luminanceShader";

import { POSTER_SIZE } from ".";

function PortalScene() {
  return (
    <>
      <color attach="background" args={["black"]} />
      <mesh position={[-0.5, 0.5, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="red"
          emissive="red"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0.5, -0.5, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="green"
          emissive="green"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

export const PlatformPoster = ({ portalScreen }) => {
  const portalScene = new THREE.Scene();
  const portalCamera = new THREE.PerspectiveCamera(
    50,
    POSTER_SIZE.width / POSTER_SIZE.height
  );

  const luminancePassRef = useRef();
  const blurPassRef = useRef();
  const bloomPassRef = useRef();

  const sceneRender = useFBO();
  const luminanceRender = useFBO();
  const vertBlurRender = useFBO();
  const horzBlurRender = useFBO();

  useFrame(({ gl }) => {
    portalCamera.position.z = 5;

    gl.setRenderTarget(sceneRender);
    gl.render(portalScene, portalCamera);
    // portalScreen.current.material.map = sceneRender.texture;

    gl.setRenderTarget(luminanceRender);
    luminancePassRef.current.uniforms.uTexture.value = sceneRender.texture;
    portalScreen.current.material = luminancePassRef.current;
    gl.render(portalScreen.current, portalCamera);

    gl.setRenderTarget(vertBlurRender);
    blurPassRef.current.uniforms.uDirection.value = new THREE.Vector2(0.0, 1.0);
    blurPassRef.current.uniforms.uTexture.value = luminanceRender.texture;
    portalScreen.current.material = blurPassRef.current;
    gl.render(portalScreen.current, portalCamera);

    gl.setRenderTarget(horzBlurRender);
    blurPassRef.current.uniforms.uDirection.value = new THREE.Vector2(1.0, 0.0);
    blurPassRef.current.uniforms.uTexture.value = luminanceRender.texture;
    portalScreen.current.material = blurPassRef.current;
    gl.render(portalScreen.current, portalCamera);

    bloomPassRef.current.uniforms.uTexture.value = sceneRender.texture;
    bloomPassRef.current.uniforms.uHBlurTexture.value = horzBlurRender.texture;
    bloomPassRef.current.uniforms.uVBlurTexture.value = vertBlurRender.texture;
    portalScreen.current.material = bloomPassRef.current;

    gl.setRenderTarget(null);
  });

  return (
    <>
      <luminanceMaterial ref={luminancePassRef} />
      <blurMaterial ref={blurPassRef} />
      <bloomMaterial ref={bloomPassRef} />
      {createPortal(<PortalScene />, portalScene)};
    </>
  );
};

export default PlatformPoster;
