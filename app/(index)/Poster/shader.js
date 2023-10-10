import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

const vertexShader = `
void main(){
  float distanceFromCenter = abs(
    (modelMatrix * vec4(position, 1.0)).x
  );

  vec3 newPosition = position;
  newPosition.y *= clamp(1.0 - (0.003 * pow(distanceFromCenter, 2.0)), 0.93, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}`;

const fragmentShader = `
uniform vec3 uColor;
void main() {
  gl_FragColor = vec4(uColor, 1.0);
}`;

const PosterMaterial = shaderMaterial(
  { uColor: [0.0, 0.0, 0.0] },
  vertexShader,
  fragmentShader
);

extend({ PosterMaterial });
