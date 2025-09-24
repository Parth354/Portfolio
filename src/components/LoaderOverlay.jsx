import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { TextureLoader } from 'three';
import Cloud from './loader/Cloud';
import CosmicBackground from './loader/CosmicBackground';
import LoadingUI from './loader/LoadingUI';

// --- Preload texture at module level so it’s cached before render ---
useTexture.preload('/cloud.png');

// 3D Scene for the loader
function Loader3DScene({ revealProgress }) {
  // Cached texture (avoids stalls on first render)
  const cloudTexture = useLoader(TextureLoader, '/cloud.png');

  // Generate cloud wall
  const cloudWalls = useMemo(() => {
    let clouds = [];
    let side = 'left'
    let dist = 0
    for (let i = 0; i < 15; i++) {
      if (side === 'left') side = 'right'
      else side = 'left'
      const zPos = -i * 0.8; // wider spacing in Z to avoid overdraw
      clouds.push({
        id: i,
        side,
        position: [
          (side === 'left' ? -1 : 1) * (dist + Math.random() * 10),
          (Math.random() - dist/20) * 25, // taller Y spread
          zPos,
        ],
        scale: [20 + Math.random() * 10, 20 + Math.random() * 10, 1],
        rotation: [0, 0, (Math.random() - 0.5) * Math.PI],
        driftOffset: Math.random() * Math.PI * 2,
      });
      dist+=1
    }
    return clouds;
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[0, 0, 15]}
        intensity={0.5 + revealProgress * 0.5}
        color="#8a2be2"
      />
      <pointLight
        position={[0, 0, 5]}
        intensity={revealProgress * 2}
        color="#e91e63"
        decay={2}
      />
      <CosmicBackground revealProgress={revealProgress} />
      {cloudWalls.map((cloud) => (
        <Cloud
          key={cloud.id}
          {...cloud}
          texture={cloudTexture}
          revealProgress={revealProgress}
        />
      ))}
    </>
  );
}

// Main Loader Overlay
export default function LoaderOverlay({ show = true, onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  const [fullyHidden, setFullyHidden] = useState(!show);
  const [progress, setProgress] = useState(0);

  // Exit sequence
  useEffect(() => {
    if (!show && !isExiting) {
      setIsExiting(true);
      setTimeout(() => {
        setFullyHidden(true);
        if (onComplete) onComplete();
      }, 2000); // fade out duration
    }
  }, [show, isExiting, onComplete]);

  // Simulated loading progress (throttled)
  useEffect(() => {
    if (show) {
      const duration = 5000;
      const startTime = Date.now();
      let raf;
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);

        // only update if changed by >1% to avoid stutters
        setProgress((prev) =>
          Math.abs(prev - newProgress) > 1 ? newProgress : prev
        );

        if (newProgress < 100) raf = requestAnimationFrame(updateProgress);
      };
      raf = requestAnimationFrame(updateProgress);
      return () => cancelAnimationFrame(raf);
    }
  }, [show]);

  const revealProgress = progress / 100;

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: '#000',
    opacity: isExiting ? 0 : 1,
    visibility: fullyHidden ? 'hidden' : 'visible',
    transition: `opacity 2s ease-out`,
    transitionDelay: isExiting ? '0s, 2s' : '0s', 
  };

  if (fullyHidden) return null;

  return (
    <div style={overlayStyle}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 70 }}
        gl={{ antialias: false, alpha: false }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 40]} />
        <Suspense fallback={null}>
          <Loader3DScene revealProgress={revealProgress} />
        </Suspense>
      </Canvas>
      <LoadingUI progress={progress} isExiting={isExiting} />
    </div>
  );
}
