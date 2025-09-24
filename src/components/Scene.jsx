import { useRef } from "react"
import { Stars } from "@react-three/drei"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { LensingEffect } from "./effects/LensingEffect"

import Starship from "./Starship"
import Asteroids from "./Asteroids"
import ShootingStars from "./ShootingStars"
import BlackHole from "./BlackHole"

import HeroScene from "./HeroScene"
import AboutScene from "./AboutScene"
import ProjectsScene from "./ProjectsScene"
import SkillsScene from "./SkillsScene"
import ContactScene from "./ContactScene"
import RingedPlanet from "./RingedPlanet"  // <-- Import the RingedPlanet

import AnimationManager from "./AnimationManager"
import CameraManager from "./CameraManager"

export default function Scene() {
  const starshipRef = useRef()
  const heroRef = useRef()
  const aboutRef = useRef()
  const projectsRef = useRef()
  const skillsRef = useRef()
  const contactRef = useRef()
  const blackHoleRef = useRef()
  const asteroidsRef = useRef()
  const lensingRef = useRef()
  const ringedPlanetRef = useRef()  // <-- Ref for RingedPlanet

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[15, 20, -20]}
        intensity={3.0}
        color="#aaccff"
        castShadow
      />

      {/* Background stars */}
      <Stars radius={200} depth={60} count={8000} factor={6} fade speed={1.5} />

      {/* Floating elements */}
      <ShootingStars />
      <Asteroids ref={asteroidsRef} />
      <Starship ref={starshipRef} />
      <HeroScene ref={heroRef} />
      <AboutScene ref={aboutRef} />
      <ProjectsScene ref={projectsRef} />
      <SkillsScene ref={skillsRef} />
      <ContactScene ref={contactRef} />
      <BlackHole ref={blackHoleRef} visible={false} />
      <RingedPlanet ref={ringedPlanetRef} position={[0, -10, -30]} /> {/* <-- Add planet */}

      {/* Animations */}
      <AnimationManager
        starshipRef={starshipRef}
        hero3DRef={heroRef}
        geodeRef={aboutRef}
        projectsRef={projectsRef}
        skillsRef={skillsRef}
        contactRef={contactRef}
        blackHoleRef={blackHoleRef}
        ringedPlanetRef={ringedPlanetRef}
      />
      <CameraManager />

      {/* Postprocessing */}
      <EffectComposer>
        <LensingEffect ref={lensingRef} strength={0} radius={0} />
        <Bloom intensity={0.7} mipmapBlur luminanceThreshold={0.8} />
        <Vignette eskil={false} offset={0.2} darkness={0.6} />
      </EffectComposer>
    </>
  )
}
