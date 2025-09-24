// src/components/TerraformedMoon.jsx
import * as THREE from "three"
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { useRef } from "react"

export default function TerraformedMoon({ ...props }) {
  // Optional: You can replace these with custom textures later
  const [bumpMap] = useLoader(TextureLoader, ["/moon_bumped.jpg"])

  const glowRef = useRef()
  const bioRef = useRef()

  // Animate terraform bio-lights pulsing
  useFrame(({ clock }) => {
    if (bioRef.current) {
      const pulse = (Math.sin(clock.elapsedTime * 2) + 1) * 0.5 // 0–1
      bioRef.current.material.emissiveIntensity = 0.4 + pulse * 0.3
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.12 + Math.sin(clock.elapsedTime * 0.5) * 0.02
    }
  })

  return (
    <group {...props}>
      {/* Base Moon Surface */}
      <mesh>
        <sphereGeometry args={[5, 128, 128]} />
        <meshStandardMaterial
          color={"#999999"}
          bumpMap={bumpMap}
          bumpScale={0.25}
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {/* Terraform Bio-Lights (glowing patches / domes) */}
      <mesh ref={bioRef}>
        <sphereGeometry args={[5.02, 128, 128]} />
        <meshStandardMaterial
          color={"#2c302dff"} // terraforming green/blue
          emissive={"#597262ff"}
          emissiveIntensity={0.6}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[5.3, 128, 128]} />
        <meshPhongMaterial
          color={"#222425ff"}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
