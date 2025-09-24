// src/components/ProjectMonolith.jsx
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function ProjectMonolith({ width = 2, height = 6, depth = 1, color = "#111111", ...props }) {
  const monolithRef = useRef()

  useFrame((state, delta) => {
    if (monolithRef.current) {
      // Slight floating motion
      monolithRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.5
    }
  })

  return (
    <group {...props}>
      {/* Monolith body */}
      <mesh ref={monolithRef}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.2}
          emissive={"#222222"}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Subtle glowing edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color={"#44bbff"} linewidth={2} />
      </lineSegments>
    </group>
  )
}
