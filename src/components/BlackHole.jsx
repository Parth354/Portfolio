// src/components/BlackHole.jsx
import { useRef, forwardRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Torus } from "@react-three/drei";
import * as THREE from "three";

const BlackHole = forwardRef(({ visible = true, ...props }, ref) => {
  const diskRef = useRef();
  const innerDiskRef = useRef();
  const horizonRef = useRef();
  const glowRef = useRef();
  const fogRef = useRef();
  const dustRef = useRef();

  // Pre-generate dust cloud
  const dustGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = THREE.MathUtils.randFloat(10, 35);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions.set([x, y, z], i * 3);
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (diskRef.current) diskRef.current.rotation.y += delta * 0.05;
    if (innerDiskRef.current) innerDiskRef.current.rotation.y += delta * 0.08;

    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }

    if (horizonRef.current) {
      horizonRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01
      );
    }

    if (fogRef.current) {
      fogRef.current.material.opacity =
        0.1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }

    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <group ref={ref} visible={visible} {...props}>
      {/* Volumetric Foggy Glow */}
      <Sphere ref={fogRef} args={[20, 64, 64]}>
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
          }}
          vertexShader={/* glsl */ `
            varying vec3 vPosition;
            void main() {
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec3 vPosition;
            void main() {
              float intensity = 0.4 / length(vPosition);
              gl_FragColor = vec4(1.0, 0.6, 0.3, intensity * 0.4);
            }
          `}
        />
      </Sphere>

      {/* Outer atmospheric glow */}
      <Sphere ref={glowRef} args={[12, 64, 64]}>
        <meshBasicMaterial
          color="#ffbb88"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      {/* Event Horizon */}
      <Sphere ref={horizonRef} args={[2, 128, 128]}>
        <meshBasicMaterial color="black" />
      </Sphere>

      {/* Photon Ring */}
      <Sphere args={[2.05, 128, 128]}>
        <meshStandardMaterial
          emissive="#ffaa44"
          emissiveIntensity={3.5}
          color="black"
          transparent
          opacity={0.95}
        />
      </Sphere>

      {/* Outer Accretion Disk */}
      <Torus ref={diskRef} args={[5, 1.2, 64, 256]} rotation={[0.5, 0, 0]}>
        <meshStandardMaterial
          emissive="#ff6600"
          emissiveIntensity={2.5}
          color="#442200"
          metalness={0.5}
          roughness={0.6}
          transparent
          opacity={0.95}
        />
      </Torus>

      {/* Inner Hot Disk */}
      <Torus ref={innerDiskRef} args={[3.5, 0.8, 64, 256]} rotation={[0.5, 0, 0]}>
        <meshStandardMaterial
          emissive="#ffd9aa"
          emissiveIntensity={4.0}
          color="#aa5522"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={0.95}
        />
      </Torus>

      {/* Dust Cloud */}
      <points ref={dustRef} geometry={dustGeometry}>
        <pointsMaterial
          color="#ffaa88"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>
    </group>
  );
});

export default BlackHole;
