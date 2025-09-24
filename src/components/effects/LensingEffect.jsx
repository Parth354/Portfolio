import React, { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { Uniform } from "three";
import { Effect } from "postprocessing";

/*
  Gravitational lensing distortion effect
  - Safe vector normalization
  - Works with postprocessing inputBuffer
*/
const fragmentShader = /* glsl */ `
  precision highp float;
  precision highp int;

  uniform vec2 center;    
  uniform float strength; 
  uniform float radius;   

  vec2 safeNormalize(vec2 v) {
    float len = length(v);
    if (len < 1e-6) return vec2(0.0);
    return v / len;
  }

  void mainUv(inout vec2 uv) {
    float dist = distance(uv, center);
    if (dist < radius) {
      float t = dist / radius;
      float falloff = 1.0 - smoothstep(0.0, 1.0, t);

      vec2 dir = safeNormalize(uv - center);
      float amount = strength * falloff * 0.12;

      uv -= dir * amount;
    }
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = texture2D(inputBuffer, uv);
  }
`;

class LensingEffectImpl extends Effect {
  constructor({ center = [0.5, 0.5], strength = 0.25, radius = 0.45 } = {}) {
    super("LensingEffect", fragmentShader, {
      uniforms: new Map([
        ["center", new Uniform(new THREE.Vector2(...center))],
        ["strength", new Uniform(strength)],
        ["radius", new Uniform(radius)],
      ]),
    });
  }

  setCenter(x, y) {
    this.uniforms.get("center").value.set(x, y); // ✅ Vector2 safe
  }
  setStrength(s) {
    this.uniforms.get("strength").value = s;
  }
  setRadius(r) {
    this.uniforms.get("radius").value = r;
  }
}

export const LensingEffect = forwardRef(
  ({ strength = 0.25, radius = 0.45, center = [0.5, 0.5] }, ref) => {
    const effect = useMemo(
      () => new LensingEffectImpl({ center, strength, radius }),
      [center[0], center[1], strength, radius]
    );
    return <primitive ref={ref} object={effect} dispose={null} />;
  }
);

export default LensingEffect;
