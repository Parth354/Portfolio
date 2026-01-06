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

  // Pre-generate dust cloud (increased count and adjusted radius for better distribution)
  const dustGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = THREE.MathUtils.randFloat(8, 40);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0.3, Math.PI - 0.3); // Avoid poles for flatter distribution

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.2; // Flatten slightly
      const z = r * Math.cos(phi);

      positions.set([x, y, z], i * 3);
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (diskRef.current) diskRef.current.rotation.y += delta * 0.1; // Faster outer disk
    if (innerDiskRef.current) innerDiskRef.current.rotation.y += delta * 0.2; // Faster inner for Doppler-like feel

    if (glowRef.current) {
      glowRef.current.material.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }

    if (horizonRef.current) {
      horizonRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.005);
    }

    if (fogRef.current) {
      fogRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }

    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group ref={ref} visible={visible} {...props}>
      {/* Volumetric outer glow - brighter white-blue for hotter plasma */}
      <Sphere ref={fogRef} args={[22, 64, 64]}>
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
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
              float intensity = 0.6 / (length(vPosition) * length(vPosition));
              vec3 color = mix(vec3(1.0, 0.8, 0.5), vec3(0.8, 0.9, 1.0), intensity * 2.0);
              gl_FragColor = vec4(color, intensity * 0.6);
            }
          `}
        />
      </Sphere>

      {/* Additive glow ring - brighter and larger */}
      <Torus ref={glowRef} args={[6, 2.5, 64, 256]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial
          color="#ffddaa"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Torus>

      {/* Event Horizon - pure black */}
      <Sphere ref={horizonRef} args={[2, 128, 128]}>
        <meshBasicMaterial color="black" />
      </Sphere>

      {/* Subtle red rim around horizon for photon ring effect */}
      <Sphere args={[2.1, 128, 128]}>
        <meshBasicMaterial
          color="#ffaaaa"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Outer accretion disk - orange, thicker, tilted */}
      <Torus ref={diskRef} args={[7, 2.2, 32, 256]} rotation={[Math.PI / 2 + 0.2, 0.1, 0]}>
        <meshStandardMaterial
          emissive="#ff8800"
          emissiveIntensity={3.0}
          color="#ffaa66"
          metalness={0.8}
          roughness={0.3}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          envMapIntensity={1.5}
        />
      </Torus>

      {/* Inner bright disk - white-hot, thinner, faster rotation */}
      <Torus ref={innerDiskRef} args={[4, 1.0, 32, 256]} rotation={[Math.PI / 2 + 0.2, 0.1, 0]}>
        <meshStandardMaterial
          emissive="#ffffff"
          emissiveIntensity={5.0}
          color="#ffffcc"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.98}
          side={THREE.DoubleSide}
        />
      </Torus>

      {/* Dust particles - warmer color, higher opacity */}
      <points ref={dustRef} geometry={dustGeometry}>
        <pointsMaterial
          color="#ffccaa"
          size={0.08}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
});

export default BlackHole;