import * as THREE from "three";

import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "glslify";

const vertexShader = glsl`
varying vec2 vUv;

void main(){
  vUv = uv;

  float distanceFromCenter = abs(
    (modelMatrix * vec4(position, 1.0)).x
  );

  vec3 newPosition = position;
  newPosition.y *= clamp(1.0 - (0.003 * pow(distanceFromCenter, 2.0)), 0.93, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}`;

const fragmentShader = glsl`
varying vec2 vUv;

uniform sampler2D uTexture;

void main() {
  vec3 texture = texture2D(uTexture, vUv).rgb;
  gl_FragColor = vec4(texture, 1.0);
}`;

const PosterMaterial = shaderMaterial(
  { uTexture: new THREE.Texture() },
  vertexShader,
  fragmentShader
);

extend({ PosterMaterial });
