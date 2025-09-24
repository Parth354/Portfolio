// src/materials/EngineFlameMaterial.js
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

/*
  EngineFlameMaterial
  - uniforms:
    uTime       : animation clock (update each frame)
    uIntensity  : brightness/flicker strength
    uScale      : global size multiplier
    uWidth      : horizontal distortion amplitude
    uHeight     : vertical stretch
    uThickness  : base horizontal scaling (overall flame width)
    uColorA..D  : gradient stops (Blue -> Yellow -> Orange -> Red)
*/

const EngineFlameMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uIntensity: 3.5,
    uScale: 3,
    uWidth: 0.05,
    uHeight: 4.0,
    uThickness: 5.0, 
    uColorA: new THREE.Color(0.2, 0.6, 1.0),  // blue
    uColorB: new THREE.Color(1.0, 0.9, 0.3),  // yellow
    uColorC: new THREE.Color(1.0, 0.5, 0.1),  // orange
    uColorD: new THREE.Color(0.8, 0.1, 0.05), // red
  },
  // vertex shader
  `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uScale;
    uniform float uWidth;
    uniform float uHeight;
    uniform float uThickness;

    varying float vProgress;
    varying vec3 vWorldPos;

    void main() {
      // normalized progress along flame (0 at base, 1 at tip)
      vProgress = (position.y * uHeight) * 0.5 + 0.5;

      vec3 p = position;

      // base horizontal thickness scaling
      p.x *= uThickness;
      p.z *= uThickness;

      // vertical stretch
      p.y *= uHeight;

      // horizontal waving distortion
      float wave1 = sin(p.y * 3.5 + uTime * 4.0);
      float wave2 = cos(p.y * 2.2 + uTime * 5.5);
      float distortion = (wave1 * 0.6 + wave2 * 0.4);

      p.x += distortion * uWidth * uIntensity * uScale;
      p.z += cos(p.y * 3.0 + uTime * 4.5) * uWidth * 0.5 * uIntensity * uScale;

      // apply global scale
      vec4 mvPosition = modelViewMatrix * vec4(p * uScale, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // world position (optional for effects)
      vWorldPos = (modelMatrix * vec4(p, 1.0)).xyz;
    }
  `,
  // fragment shader
  `
    precision highp float;

    uniform float uTime;
    uniform float uIntensity;

    uniform vec3 uColorA; // blue
    uniform vec3 uColorB; // yellow
    uniform vec3 uColorC; // orange
    uniform vec3 uColorD; // red

    varying float vProgress;
    varying vec3 vWorldPos;

    void main() {
      // flicker animation
      float flicker = sin(vProgress * 10.0 - uTime * 6.0) * 0.25 + 0.85;
      flicker = mix(0.9, 1.15, pow(flicker, 1.2));

      vec3 color;
      // gradient bands (blue -> yellow -> orange -> red)
      if (vProgress < 0.25) {
        float t = smoothstep(0.0, 0.25, vProgress);
        color = mix(uColorA, uColorB, t);
      } else if (vProgress < 0.6) {
        float t = smoothstep(0.25, 0.6, vProgress);
        color = mix(uColorB, uColorC, t);
      } else {
        float t = smoothstep(0.6, 1.0, vProgress);
        color = mix(uColorC, uColorD, t);
      }

      color *= flicker * uIntensity;

      // alpha fades toward the tip
      float alpha = clamp((1.25 - vProgress) * uIntensity * 1.6, 0.0, 1.0);

      // soft edge
      float edge = smoothstep(0.0, 0.95, 1.0 - vProgress);
      alpha *= edge;

      gl_FragColor = vec4(color, alpha);
    }
  `
);

// blending & transparency settings
EngineFlameMaterial.transparent = true;
EngineFlameMaterial.depthWrite = false;
EngineFlameMaterial.blending = THREE.AdditiveBlending;
EngineFlameMaterial.side = THREE.DoubleSide;

// make available as <engineFlameMaterial />
extend({ EngineFlameMaterial });

export default EngineFlameMaterial;
