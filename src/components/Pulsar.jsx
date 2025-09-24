// src/components/Pulsar.jsx
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Pulsar({ radius = 2, color = "#44bbff", ...props }) {
  const starRef = useRef()
  const beamRef = useRef()

  useFrame((state, delta) => {
    // Pulsar rotates fast
    if (starRef.current) starRef.current.rotation.y += delta * 3
    if (beamRef.current) beamRef.current.rotation.y += delta * 3
  })

  return (
    <group {...props}>
      {/* Pulsar core */}
      <mesh ref={starRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={2}
          color={color}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* Pulsar beam (simple cylinder with glow) */}
      <mesh ref={beamRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, radius * 10, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <mesh ref={beamRef} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, radius * 10, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}
