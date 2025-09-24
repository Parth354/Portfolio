import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

// --- CONFIGURATION ---
const DRIFT_SPEED = 0.2;       // Faster, more noticeable drift
const PART_SPEED = 0.2;        // How quickly the clouds react to the parting animation
const PART_DISTANCE = 60;      // How far the clouds will travel off-screen
const REVEAL_START = 0.1;      // Start parting at 10% progress

export default function Cloud({
  texture,
  revealProgress,
  side,
  position,
  scale,
  rotation,
  driftOffset,
}) {
  const ref = useRef();

  // Store initial position so drifting + parting are stable
  const initialX = useRef(position[0]);
  const initialY = useRef(position[1]);

  useFrame((state) => {
    if (!ref.current) return;

    // --- PHASE 1: Gentle drifting ---
    const driftTime = state.clock.elapsedTime;
    const driftX = Math.sin(driftTime * DRIFT_SPEED + driftOffset) * 5; // wider horizontal sway
    const driftY = Math.cos(driftTime * DRIFT_SPEED * 0.7 + driftOffset) * 3; // vertical drift

    // --- PHASE 2: Parting clouds ---
    const partProgress = Math.max(
      0,
      (revealProgress - REVEAL_START) / (1 - REVEAL_START)
    );
    const easedPartProgress = partProgress * partProgress; // ease-in
    const direction = side === 'left' ? -1 : 1;
    const partX = easedPartProgress * PART_DISTANCE * direction;

    // --- Combine motions ---
    const targetX = initialX.current + driftX + partX;
    const targetY = initialY.current + driftY;

    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      targetX,
      PART_SPEED
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      targetY,
      PART_SPEED
    );

    // --- Fade out as they part ---
    if (ref.current.material) {
      const targetOpacity = Math.max(0, 0.85 - easedPartProgress * 0.8);
      ref.current.material.opacity = THREE.MathUtils.lerp(
        ref.current.material.opacity,
        targetOpacity,
        0.05
      );
    }
  });

  return (
    <Plane
      ref={ref}
      args={[1, 1]}
      position={position}
      scale={scale}
      rotation={rotation}
    >
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        color={new THREE.Color(0x5e3575)} // solid hex works properly
        depthWrite={false}
      />
    </Plane>
  );
}
