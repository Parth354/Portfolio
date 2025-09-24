import React, { useRef, useMemo, useState, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Enable the new ColorManagement API
THREE.ColorManagement.enabled = true;

/**
 * TechLogo - floating tech node
 */
function TechLogo({
  name,
  position = [0, 0, 0],
  color = "#ffffff",
  floatSpeed = 1,
  rotationIntensity = 1,
  logoUrl = null,
  size = 1.2,
}) {
  const meshRef = useRef();

  // Load texture with caching
  const texture = logoUrl ? useLoader(THREE.TextureLoader, logoUrl) : null;
  // sRGBEncoding is no longer needed or available in recent three.js versions

  // Random rotation offset for variety
  const rotOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  // Fallback geometry
  const fallback = useMemo(() => {
    const n = (name || "").toLowerCase();
    if (n.includes("react")) return { type: "torus", args: [size * 0.55, size * 0.15, 12, 32] };
    if (n.includes("python")) return { type: "box", args: [size * 0.7, size * 0.45, 0.2] };
    if (n.includes("mongo")) return { type: "cylinder", args: [size * 0.3, size * 0.45, size * 0.55, 8] };
    if (n.includes("node")) return { type: "octahedron", args: [size * 0.5] };
    if (n.includes("js") || n.includes("javascript")) return { type: "box", args: [size * 0.55, size * 0.55, 0.2] };
    if (n.includes("aws")) return { type: "tetrahedron", args: [size * 0.55] };
    return { type: "sphere", args: [size * 0.45, 16, 16] };
  }, [name, size]);

  // Float and rotation animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.25 * rotationIntensity + rotOffset;
      meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.05 * rotationIntensity;
    }
  });

  // Map type to Three geometry constructor
  const GeoMap = {
    sphere: THREE.SphereGeometry,
    box: THREE.BoxGeometry,
    cylinder: THREE.CylinderGeometry,
    torus: THREE.TorusGeometry,
    octahedron: THREE.OctahedronGeometry,
    tetrahedron: THREE.TetrahedronGeometry,
  };

  return (
    <Float speed={floatSpeed} rotationIntensity={rotationIntensity} floatIntensity={0.6} position={position}>
      <group ref={meshRef}>
        {texture ? (
          <mesh rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[size * 1.3, size * 1.3]} />
            <meshStandardMaterial map={texture} transparent side={THREE.FrontSide} />
          </mesh>
        ) : (
          <mesh scale={[1.2, 1.2, 1.2]}>
            <primitive object={new GeoMap[fallback.type](...fallback.args)} attach="geometry" />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              metalness={0.4}
              roughness={0.35}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

/**
 * BinarySystem - 3D tech cluster
 */
export default function BinarySystem({
  radius = 7,
  starSize = 1.6,
  skillRadius = 3,
  techStack = [
    { name: "React", color: "#61dafb", logoUrl: null },
    { name: "Python", color: "#3776ab", logoUrl: null },
    { name: "C++", color: "#00599c", logoUrl: null },
    { name: "MongoDB", color: "#47a248", logoUrl: null },
    { name: "NodeJS", color: "#339933", logoUrl: null },
    { name: "JavaScript", color: "#f7df1e", logoUrl: null },
    { name: "TypeScript", color: "#3178c6", logoUrl: null },
    { name: "Docker", color: "#2496ed", logoUrl: null },
    { name: "AWS", color: "#ff9900", logoUrl: null },
    { name: "Git", color: "#f05032", logoUrl: null },
  ],
  ...props
}) {
  const groupRef = useRef();
  const leftStarRef = useRef();
  const rightStarRef = useRef();
  const centerGroupRef = useRef();

  // Tech logo positions
  const techPositions = useMemo(() => {
    return techStack.map((_, i) => {
      const angle = (i / techStack.length) * Math.PI * 2;
      const dist = radius * 1.2 + (i % 3) * 0.6;
      const h = Math.sin(angle * 1.8) * 1.6;
      return [Math.cos(angle) * dist, h, Math.sin(angle) * dist * 0.65];
    });
  }, [techStack, radius]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const orbitSpeed = 0.3;

    const lx = Math.cos(t * orbitSpeed) * radius;
    const ly = Math.sin(t * orbitSpeed) * radius * 0.45;
    const rx = Math.cos(t * orbitSpeed + Math.PI) * radius;
    const ry = Math.sin(t * orbitSpeed + Math.PI) * radius * 0.45;

    if (leftStarRef.current) leftStarRef.current.position.set(lx, ly, 0);
    if (rightStarRef.current) rightStarRef.current.position.set(rx, ry, 0);

    if (groupRef.current) groupRef.current.rotation.z = Math.sin(t * 0.05) * 0.04;
    if (centerGroupRef.current) {
      centerGroupRef.current.rotation.y = t * 0.25;
      centerGroupRef.current.position.y = Math.sin(t * 0.35) * 0.12;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Lights */}
      <ambientLight intensity={0.35} />
      <pointLight position={[radius * 1.2, 2, 4]} intensity={0.8} distance={35} color="#66aaff" />
      <pointLight position={[-radius * 0.9, 1, 2]} intensity={0.7} distance={35} color="#ffd9b3" />

      {/* Center orb */}
      <group ref={centerGroupRef} position={[0, 0, 0]}>
        <mesh>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial
            color="#7a2cff"
            emissive="#5ab3ff"
            emissiveIntensity={0.25}
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={0.98}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.08, 14, 120]} />
          <meshStandardMaterial color="#2ea6ff" emissive="#2ea6ff" emissiveIntensity={0.12} />
        </mesh>
      </group>

      {/* Floating logos */}
      {techStack.map((tech, i) => (
        <Suspense fallback={null} key={tech.name + "-" + i}>
          <TechLogo
            name={tech.name}
            position={techPositions[i]}
            color={tech.color}
            logoUrl={tech.logoUrl}
            floatSpeed={1 + (i % 3) * 0.4}
            rotationIntensity={0.4 + (i % 2) * 0.25}
            size={0.9}
          />
        </Suspense>
      ))}

      {/* Stars */}
      <mesh ref={leftStarRef}>
        <sphereGeometry args={[starSize, 32, 32]} />
        <meshStandardMaterial emissive="#44c0ff" emissiveIntensity={1} color="#2b6f9a" />
      </mesh>

      <mesh ref={rightStarRef}>
        <sphereGeometry args={[starSize * 0.95, 32, 32]} />
        <meshStandardMaterial emissive="#ffdfe6" emissiveIntensity={0.9} color="#f5f7ff" />
      </mesh>
    </group>
  );
}