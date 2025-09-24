import { useRef, useLayoutEffect, forwardRef } from "react"
import { useFrame, extend } from "@react-three/fiber"
import { useGLTF, SpotLight } from "@react-three/drei"
import * as THREE from "three"
import EngineFlameMaterial from "./shaders/EngineFlameMaterial"

extend({ EngineFlameMaterial })

const Starship = forwardRef(function Starship(props, ref) {
  const { scene } = useGLTF("/starship/scene.gltf")
  const flameMaterialRef = useRef()

  // Apply tweaks to model materials
  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set("white")
        child.castShadow = true
        child.material.envMapIntensity = 1.5
        child.material.metalness = 0.5
        child.material.roughness = 0.4
      }
    })
  }, [scene])

  // Animate flame shader
  useFrame((state) => {
    if (flameMaterialRef.current) {
      flameMaterialRef.current.uTime = state.clock.getElapsedTime()
    }
  })

  // Spotlight target
  const lightTarget = new THREE.Object3D()
  lightTarget.position.set(0, 0, -5)

  return (
    <group ref={ref} {...props}>
      {/* Starship model */}
      <primitive object={scene} scale={0.008} rotation-y={Math.PI/5} />

      {/* Spotlight */}
      <SpotLight
        target={lightTarget}
        position={[0, 1, 0]}
        angle={0.5}
        penumbra={0.5}
        distance={30}
        intensity={0.8}
        color="cyan"
        castShadow
      />
      <primitive object={lightTarget} />

      {/* Engine Flame */}
      <mesh
        position={[0,-52, 0]}
        rotation-x={Math.PI / 2}
        rotation-y={-Math.PI/2}
        rotation-z={-Math.PI/2}
        name="EngineFlame"
      >
        <coneGeometry args={[0.25, 1.6, 12]} />
        <engineFlameMaterial ref={flameMaterialRef} transparent />
      </mesh>
    </group>
  )
})

export default Starship
