import React, { Suspense,lazy, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
const Scene = lazy(() => import("./Scene"));

function LoadingManager({ setIsLoading }) {
  const { active } = useProgress();
  useEffect(() => { if (!active) setIsLoading(false); }, [active, setIsLoading]);
  return null;
}

export default function CanvasBackground({ isLoading, setIsLoading }) {
  return (
    <div
      id="canvas-container"
      style={{
        opacity: isLoading ? 0 : 1,
        pointerEvents: isLoading ? "none" : "auto",
        transition: "opacity 1s ease-in 0.5s",
      }}
    >
      <Canvas gl={{ antialias: true, alpha: false }}>
        <Suspense fallback={null}>
          <color attach="background" args={["#000000"]} />
          <Scene />
          <LoadingManager setIsLoading={setIsLoading} />
        </Suspense>
      </Canvas>
    </div>
  );
}
