// src/components/Asteroids.jsx
import { forwardRef, useMemo, useRef } from "react"
import { useGLTF, Instances, Instance } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const ASTEROID_GEOMETRY_NAME = "Asteroid_Small_6_0"

useGLTF.preload("/asteroid/scene.gltf")

const Asteroids = forwardRef((props, ref) => {
  const { nodes } = useGLTF("/asteroid/scene.gltf")

  // Geometry & Material fallback
  const asteroidGeometry =
    nodes[ASTEROID_GEOMETRY_NAME]?.geometry || new THREE.SphereGeometry(0.5, 8, 8)

  const asteroidMaterial =
    nodes[ASTEROID_GEOMETRY_NAME]?.material ||
    new THREE.MeshStandardMaterial({ color: "#555", roughness: 1, metalness: 0 })

  // Pre-generate random asteroid transforms with speed
  const asteroids = useMemo(
    () =>
      Array.from({ length: 300 }).map(() => ({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 200, // spread out
          (Math.random() - 0.5) * 200,
          -200 - Math.random() * 800 // start far away in z
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale: 0.7 + Math.random() * 1.2, // smaller scale
        speed: 0.2 + Math.random() * 0.6, // z movement speed
      })),
    []
  )

  const instancesRef = useRef([])

  // Animate asteroids
  useFrame((state) => {
    const heroSectionZ = -20 // approximate region around Hero3D

    instancesRef.current.forEach((inst, i) => {
      if (!inst) return
      const data = asteroids[i]

      // Move forward
      inst.position.z += data.speed

      // Skip around Hero3D section (avoid clutter)
      if (inst.position.z > heroSectionZ - 5 && inst.position.z < heroSectionZ + 5) {
        inst.position.z += 10
      }

      // Reset when passing camera
      if (inst.position.z > 10) {
        inst.position.z = -800
        inst.position.x = (Math.random() - 0.5) * 200
        inst.position.y = (Math.random() - 0.5) * 200
      }

      // Rotate slowly
      inst.rotation.x += 0.002
      inst.rotation.y += 0.001
    })
  })

  return (
    <group ref={ref}>
      <Instances geometry={asteroidGeometry} material={asteroidMaterial} castShadow>
        {asteroids.map((data, i) => (
          <Instance
            key={i}
            ref={(el) => (instancesRef.current[i] = el)}
            {...data}
          />
        ))}
      </Instances>
    </group>
  )
})

export default Asteroids
