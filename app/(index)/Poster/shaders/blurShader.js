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
uniform float uResolution;
uniform float uRadius;
uniform vec2 uDirection;

void main() {
	//this will be our RGBA sum
	vec4 sum = vec4(0.0);
	
	//our original texcoord for this fragment
	vec2 uv = vUv;
	
	//the amount to blur, i.e. how far off center to sample from 
	//1.0 -> blur by one pixel
	//2.0 -> blur by two pixels, etc.
	float blur = uRadius / uResolution; 
    
	//the direction of our blur
	//(1.0, 0.0) -> x-axis blur
	//(0.0, 1.0) -> y-axis blur
	float hstep = uDirection.x;
	float vstep = uDirection.y;
    
	//apply blurring, using a 9-tap filter with predefined gaussian weights
    
	sum += texture2D(uTexture, vec2(uv.x - 4.0*blur*hstep, uv.y - 4.0*blur*vstep)) * 0.0162162162;
	sum += texture2D(uTexture, vec2(uv.x - 3.0*blur*hstep, uv.y - 3.0*blur*vstep)) * 0.0540540541;
	sum += texture2D(uTexture, vec2(uv.x - 2.0*blur*hstep, uv.y - 2.0*blur*vstep)) * 0.1216216216;
	sum += texture2D(uTexture, vec2(uv.x - 1.0*blur*hstep, uv.y - 1.0*blur*vstep)) * 0.1945945946;
	
	sum += texture2D(uTexture, vec2(uv.x, uv.y)) * 0.2270270270;
	
	sum += texture2D(uTexture, vec2(uv.x + 1.0*blur*hstep, uv.y + 1.0*blur*vstep)) * 0.1945945946;
	sum += texture2D(uTexture, vec2(uv.x + 2.0*blur*hstep, uv.y + 2.0*blur*vstep)) * 0.1216216216;
	sum += texture2D(uTexture, vec2(uv.x + 3.0*blur*hstep, uv.y + 3.0*blur*vstep)) * 0.0540540541;
	sum += texture2D(uTexture, vec2(uv.x + 4.0*blur*hstep, uv.y + 4.0*blur*vstep)) * 0.0162162162;

	//discard alpha for our simple demo and return
	gl_FragColor = vec4(sum.rgb, 1.0);
}`;

const BlurMaterial = shaderMaterial(
  {
    uTexture: null,
    uResolution: 20.0,
    uRadius: 1.0,
    uDirection: null,
  },
  vertexShader,
  fragmentShader
);

extend({ BlurMaterial });
