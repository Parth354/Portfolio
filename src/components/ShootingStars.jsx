// src/components/ShootingStars.jsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Instances, Instance } from "@react-three/drei";
import * as THREE from "three";

/* ---------- Helpers ---------- */
function vecToObj(v) {
  if (!v) return null;
  return { x: Number(v.x), y: Number(v.y), z: Number(v.z) };
}
function isFiniteVector3(v) {
  return v && Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z);
}
function nowTag() {
  return new Date().toISOString();
}

/* ---------- Path generator ---------- */
function generatePath(index, total) {
  const angleOffset = (index / total) * Math.PI * 2;
  const radiusVariation = THREE.MathUtils.randFloat(25, 40);

  const start = new THREE.Vector3(
    Math.cos(angleOffset) * radiusVariation + THREE.MathUtils.randFloat(-10, 10),
    THREE.MathUtils.randFloat(20, 35),
    Math.sin(angleOffset) * radiusVariation + THREE.MathUtils.randFloat(-10, 10)
  );

  const arcAngle = THREE.MathUtils.randFloat(0.3, 0.7) * Math.PI;
  const distance = THREE.MathUtils.randFloat(40, 60);

  const end = new THREE.Vector3(
    start.x + Math.cos(arcAngle) * distance,
    -25 + THREE.MathUtils.randFloat(-5, 5),
    start.z + Math.sin(arcAngle) * distance
  );

  const control = new THREE.Vector3(
    (start.x + end.x) * 0.5 + THREE.MathUtils.randFloat(-15, 15),
    start.y * 0.6,
    (start.z + end.z) * 0.5 + THREE.MathUtils.randFloat(-15, 15)
  );

  return {
    start,
    end,
    control,
    duration: THREE.MathUtils.randFloat(2.5, 4.5),
    trailLength: THREE.MathUtils.randFloat(3, 5),
    speed: THREE.MathUtils.randFloat(0.8, 1.2),
    size: THREE.MathUtils.randFloat(0.08, 0.15),
    intensity: THREE.MathUtils.randFloat(3, 7),
  };
}

/* ---------- Comet with Tube trail ---------- */
function Comet({ path, onComplete, delay = 0, debugId = "?" }) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const glowRef = useRef(null);
  const materialRef = useRef(null);
  const progressRef = useRef(-delay);
  const [isActive, setIsActive] = useState(false);
  const curve = useRef(null);
  const trailGeometry = useRef(null);

  useEffect(() => {
    if (!isFiniteVector3(path.start) || !isFiniteVector3(path.control) || !isFiniteVector3(path.end)) {
      console.warn(`Comet:${debugId} invalid path vectors — using fallback`);
      curve.current = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 25, 0),
        new THREE.Vector3(10, 20, 10),
        new THREE.Vector3(30, -20, 30)
      );
    } else {
      curve.current = new THREE.QuadraticBezierCurve3(path.start, path.control, path.end);
    }
    setIsActive(false);
    progressRef.current = -delay;
  }, [path, delay, debugId]);

  useFrame((state, delta) => {
    if (!groupRef.current || !curve.current) return;

    progressRef.current += (delta / path.duration) * path.speed;

    if (progressRef.current < 0) {
      groupRef.current.visible = false;
      return;
    }

    if (!isActive && progressRef.current >= 0) {
      setIsActive(true);
      groupRef.current.visible = true;
    }

    if (progressRef.current >= 1) {
      onComplete();
      return;
    }

    const t = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const tmp = new THREE.Vector3();
    curve.current.getPoint(t, tmp);
    groupRef.current.position.copy(tmp);

    // orientation
    const tangent = new THREE.Vector3();
    curve.current.getTangent(t, tangent);
    if (isFiniteVector3(tangent)) {
      groupRef.current.lookAt(
        tmp.x + tangent.x,
        tmp.y + tangent.y,
        tmp.z + tangent.z
      );
    }

    // visuals
    const fadeIn = THREE.MathUtils.smoothstep(t, 0, 0.1);
    const fadeOut = THREE.MathUtils.smoothstep(t, 0.7, 1);
    const opacity = fadeIn * (1 - fadeOut);

    if (materialRef.current) {
      materialRef.current.opacity = opacity * 0.9;
      materialRef.current.emissiveIntensity = path.intensity * opacity;
    }

    if (glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 8) * 0.2 + 0.8;
      glowRef.current.scale.setScalar(1 + pulse * opacity * 0.3);
      glowRef.current.material.opacity = opacity * 0.4 * pulse;
    }

    if (coreRef.current) {
      const hue = (t * 60 + 180) % 360;
      coreRef.current.material.emissive.setHSL(hue / 360, 1, 0.5);
    }

    // Update Tube trail
    if (trailGeometry.current) {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const tt = THREE.MathUtils.lerp(Math.max(0, t - 0.1), t, i / 20);
        const pos = curve.current.getPoint(tt);
        points.push(pos);
      }
      const tubeCurve = new THREE.CatmullRomCurve3(points);
      trailGeometry.current.dispose();
      trailGeometry.current = new THREE.TubeGeometry(tubeCurve, 20, path.size * 0.5, 8, false);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {isActive && (
        <>
          {/* Trail */}
          <mesh>
            <primitive object={trailGeometry.current || new THREE.BufferGeometry()} attach="geometry" />
            <meshBasicMaterial
              color="#8AFFFF"
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Core */}
          <Sphere ref={coreRef} args={[path.size, 16, 16]}>
            <meshStandardMaterial
              ref={materialRef}
              color="#ffffff"
              emissive="#4AFFFF"
              emissiveIntensity={path.intensity}
              transparent
              opacity={0}
              toneMapped={false}
            />
          </Sphere>

          {/* Glow */}
          <Sphere ref={glowRef} args={[path.size * 2, 8, 8]}>
            <meshBasicMaterial
              color="#8AFFFF"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </Sphere>
        </>
      )}
    </group>
  );
}

/* ---------- SparkSystem ---------- */
function SparkSystem({ count = 50 }) {
  const meshRef = useRef();
  const particlesRef = useRef([]);

  useEffect(() => {
    particlesRef.current = Array.from({ length: count }, () => {
      const p = new THREE.Vector3(
        THREE.MathUtils.randFloat(-50, 50),
        THREE.MathUtils.randFloat(-30, 40),
        THREE.MathUtils.randFloat(-50, 50)
      );
      const v = new THREE.Vector3(
        THREE.MathUtils.randFloat(-0.5, 0.5),
        THREE.MathUtils.randFloat(-1, -0.2),
        THREE.MathUtils.randFloat(-0.5, 0.5)
      );
      return { position: p, velocity: v, life: 1, lifeSpeed: THREE.MathUtils.randFloat(0.1, 0.3) };
    });
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position;

    particlesRef.current.forEach((particle, i) => {
      particle.life -= delta * particle.lifeSpeed;
      if (particle.life <= 0) {
        particle.position.set(
          THREE.MathUtils.randFloat(-50, 50),
          THREE.MathUtils.randFloat(30, 40),
          THREE.MathUtils.randFloat(-50, 50)
        );
        particle.velocity.set(
          THREE.MathUtils.randFloat(-0.5, 0.5),
          THREE.MathUtils.randFloat(-1, -0.2),
          THREE.MathUtils.randFloat(-0.5, 0.5)
        );
        particle.life = 1;
      }
      particle.position.add(particle.velocity.clone().multiplyScalar(delta * 10));
      positions.setXYZ(i, particle.position.x, particle.position.y, particle.position.z);
    });

    positions.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#FFD700"
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ---------- Main component ---------- */
export default function ShootingStars({ count = 8, sparkCount = 30 }) {
  const [comets, setComets] = useState([]);
  const pathsRef = useRef([]);
  const cometIdCounter = useRef(0);

  useEffect(() => {
    pathsRef.current = Array.from({ length: count }, (_, i) => generatePath(i, count));
    const initialComets = Array.from({ length: count }, (_, i) => ({
      id: cometIdCounter.current++,
      pathIndex: i,
      delay: i * 0.5,
    }));
    setComets(initialComets);
  }, [count]);

  const handleCometComplete = (id) => {
    setComets((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              id: cometIdCounter.current++,
              pathIndex: c.pathIndex,
              delay: THREE.MathUtils.randFloat(0, 2),
            }
          : c
      )
    );
    pathsRef.current = pathsRef.current.map((p, i) => generatePath(i, count));
  };

  return (
    <group>
      {comets.map((comet) => (
        <Comet
          key={comet.id}
          debugId={comet.id}
          path={pathsRef.current[comet.pathIndex]}
          delay={comet.delay}
          onComplete={() => handleCometComplete(comet.id)}
        />
      ))}
      <SparkSystem count={sparkCount} />
      <Instances limit={20} position={[0, 0, -100]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial color="#FFA500" />
        {Array.from({ length: 20 }, (_, i) => (
          <Instance
            key={i}
            position={[
              THREE.MathUtils.randFloat(-100, 100),
              THREE.MathUtils.randFloat(0, 50),
              THREE.MathUtils.randFloat(-50, 50),
            ]}
            scale={THREE.MathUtils.randFloat(0.5, 1.5)}
          />
        ))}
      </Instances>
    </group>
  );
}
