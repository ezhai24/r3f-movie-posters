import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "glslify";

const vertexShader = glsl`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = glsl`
varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uHBlurTexture;
uniform sampler2D uVBlurTexture;

void main() {
  vec4 sum = vec4(0.0);

  sum += texture2D(uTexture, vUv);
  sum += texture2D(uHBlurTexture, vUv);
  sum += texture2D(uVBlurTexture, vUv);

	gl_FragColor = vec4(sum.rgb, 1.0);
}`;

const BloomMaterial = shaderMaterial(
  {
    uTexture: null,
    uHBlurTexture: null,
    uVBlurTexture: null,
  },
  vertexShader,
  fragmentShader
);

extend({ BloomMaterial });
