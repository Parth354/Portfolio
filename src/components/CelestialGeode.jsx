import { useRef, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/* --- Atmospheric Mist --- */
const AtmosphericMist = ({ radius = 8, density = 200, color = "#66ccff" }) => {
  const pointsRef = useRef();

  const positions = new Float32Array(density * 3);
  for (let i = 0; i < density; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius + Math.random() * 2.5; // smaller shell
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8; // tighter vertical
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        transparent
        color={color}
        size={0.15}
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

/* --- Celestial Geode --- */
const CelestialGeode = forwardRef((props, ref) => {
  const coreRef = useRef();
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.0015;
    }
    if (ring1.current) {
      ring1.current.rotation.z += 0.002;
    }
    if (ring2.current) {
      ring2.current.rotation.x -= 0.0015;
    }
  });

  return (
    <group ref={ref} {...props}>
      {/* Mist Layers (smaller radius) */}
      <AtmosphericMist radius={10} density={250} color="#44aaff" />
      <AtmosphericMist radius={15} density={180} color="#00ffaa" />

      {/* Planet Core (reduced) */}
      <Sphere ref={coreRef} args={[2.5, 48, 48]}>
        <meshStandardMaterial
          color="#220044"
          emissive="#5500aa"
          emissiveIntensity={1.0}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>

      {/* Energy Rings (smaller) */}
      <mesh ref={ring1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[4, 0.08, 16, 80]} />
        <meshStandardMaterial
          color="#00ffaa"
          emissive="#00ffaa"
          emissiveIntensity={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh ref={ring2} rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry args={[6, 0.08, 16, 80]} />
        <meshStandardMaterial
          color="#44aaff"
          emissive="#44aaff"
          emissiveIntensity={0.7}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
});

export default CelestialGeode;
