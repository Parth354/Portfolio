// src/components/RingedPlanet.jsx
import { useRef, forwardRef } from 'react'
import { Sphere, Ring, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

/* ---------------- CLOUD LAYERS ---------------- */
const CloudLayer = ({ radius = 8, density = 1500, color = "#ffffff" }) => {
  const cloudRef = useRef()

  const positions = new Float32Array(density * 3)
  for (let i = 0; i < density; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius + Math.random() * 4
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }

  return (
    <Points ref={cloudRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color={color}
        size={0.2}
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

/* ---------------- MAIN RINGED PLANET ---------------- */
const RingedPlanet = forwardRef((props, ref) => {
  return (
    <group ref={ref} {...props}>
      {/* Clouds */}
      <CloudLayer radius={12} density={2500} color="#ff8866" />
      <CloudLayer radius={15} density={2000} color="#ffaa88" />
      <CloudLayer radius={18} density={1500} color="#ffccaa" />

      {/* Planet core */}
      <Sphere args={[7, 64, 64]}>
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#cc4400"
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.3}
        />
      </Sphere>

      {/* Atmosphere */}
      <Sphere args={[7.8, 32, 32]}>
        <meshBasicMaterial color="#ffaa77" transparent opacity={0.15} side={THREE.BackSide} />
      </Sphere>

      {/* Rings */}
      <group>
        <Ring args={[8.5, 14, 128]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#ffcc88" transparent opacity={0.7} side={THREE.DoubleSide} />
        </Ring>
        <Ring args={[15, 19, 96]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#ffaa66" transparent opacity={0.5} side={THREE.DoubleSide} />
        </Ring>
        <Ring args={[20, 23, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#ff8844" transparent opacity={0.3} side={THREE.DoubleSide} />
        </Ring>
      </group>
    </group>
  )
})

export default RingedPlanet
