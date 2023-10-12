import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float brightPassThreshold = 0.3;

  vec3 luminanceVector = vec3(0.2125, 0.7154, 0.0721);
  vec3 texture = texture2D(uTexture, uv).rgb;

  float luminance = dot(luminanceVector, texture);
  luminance = max(0.0, luminance - brightPassThreshold);

  texture.rgb *= sign(luminance);

  gl_FragColor = vec4(texture, 1.0);
}`;

const LuminanceMaterial = shaderMaterial(
  { uTexture: null },
  vertexShader,
  fragmentShader
);

extend({ LuminanceMaterial });
