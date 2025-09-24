import React, { useRef } from 'react';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function CosmicBackground({ revealProgress }) {
  const meshRefs = useRef([]);

  useFrame(() => {
    // smoother easing instead of linear
    const easedProgress = THREE.MathUtils.smoothstep(revealProgress, 0, 1);

    meshRefs.current.forEach((mesh, index) => {
      if (mesh && mesh.material) {
        // Each layer fades in at a slightly different offset
        const offset = index * 0.15;
        const targetOpacity = Math.max(
          0.05,
          (easedProgress - offset) * (0.8 - index * 0.15)
        );
        mesh.material.opacity = THREE.MathUtils.lerp(
          mesh.material.opacity,
          targetOpacity,
          0.05
        );
      }
    });
  });

  return (
    <>
      <Plane ref={el => (meshRefs.current[0] = el)} args={[200, 200]} position={[0, 0, -30]}>
        <meshBasicMaterial transparent opacity={0} color="#050510" />
      </Plane>
      <Plane ref={el => (meshRefs.current[1] = el)} args={[150, 150]} position={[0, 0, -28]}>
        <meshBasicMaterial transparent opacity={0} color="#4a0e4e" blending={THREE.AdditiveBlending} />
      </Plane>
      <Plane ref={el => (meshRefs.current[2] = el)} args={[100, 100]} position={[0, 0, -26]}>
        <meshBasicMaterial transparent opacity={0} color="#8a2be2" blending={THREE.AdditiveBlending} />
      </Plane>
      <Plane ref={el => (meshRefs.current[3] = el)} args={[80, 80]} position={[0, 0, -24]}>
        <meshBasicMaterial transparent opacity={0} color="#e91e63" blending={THREE.AdditiveBlending} />
      </Plane>
    </>
  );
}
