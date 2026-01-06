import React, { useRef, useMemo } from 'react';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function CosmicBackground({ revealProgress = 0 }) {
  const meshRefs = useRef([]);

  // Subtle parallax rotation for depth
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const easedProgress = THREE.MathUtils.smoothstep(revealProgress, 0, 1);

    meshRefs.current.forEach((mesh, index) => {
      if (mesh) {
        // Gentle rotation for parallax feel
        mesh.rotation.z = time * 0.0005 * (index + 1);

        if (mesh.material) {
          const offset = index * 0.12;
          let targetOpacity = easedProgress - offset;
          if (index === 0) targetOpacity *= 0.6; // Deepest layer less intense
          if (index >= 3) targetOpacity *= 1.2; // Brighter pink/cyan layers pop more

          targetOpacity = THREE.MathUtils.clamp(targetOpacity, 0, 1) * (0.8 - index * 0.08);

          mesh.material.opacity = THREE.MathUtils.lerp(
            mesh.material.opacity || 0,
            Math.max(0.02, targetOpacity),
            0.08
          );
        }
      }
    });
  });

  return (
    <>
      {/* Layer 1: Deep dark blue-purple base */}
      <Plane ref={el => (meshRefs.current[0] = el)} args={[300, 300]} position={[0, 0, -40]}>
        <meshBasicMaterial
          transparent
          opacity={0}
          color="#0a001f"
          depthWrite={false}
        />
      </Plane>

      {/* Layer 2: Subtle dark purple nebula glow */}
      <Plane ref={el => (meshRefs.current[1] = el)} args={[250, 250]} position={[0, 0, -35]}>
        <meshBasicMaterial
          transparent
          opacity={0}
          color="#2a004a"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Plane>

      {/* Layer 3: Rich blue-violet nebula (core cosmic color) */}
      <Plane ref={el => (meshRefs.current[2] = el)} args={[200, 200]} position={[0, 0, -30]}>
        <meshBasicMaterial
          transparent
          opacity={0}
          color="#3b0d82"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Plane>

      {/* Layer 4: Magenta-pink accents (like real emission nebulae) */}
      <Plane ref={el => (meshRefs.current[3] = el)} args={[150, 150]} position={[0, 0, -25]}>
        <meshBasicMaterial
          transparent
          opacity={0}
          color="#9c27b0"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Plane>

      {/* Layer 5: Bright cyan/white hot spots (for contrast and realism) */}
      <Plane ref={el => (meshRefs.current[4] = el)} args={[120, 120]} position={[0, 0, -20]}>
        <meshBasicMaterial
          transparent
          opacity={0}
          color="#00e5ff"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Plane>
    </>
  );
}