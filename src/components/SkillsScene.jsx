import { forwardRef, Suspense } from "react";
import { Stars, Preload } from "@react-three/drei";
import BinarySystem from "./BinarySystem";

// Loading fallback function
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

const SkillsScene = forwardRef((props, ref) => {
  const techStack = [
    { name: "React", color: "#61dafb", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Python", color: "#3776ab", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "C++", color: "#00599c", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
    { name: "MongoDB", color: "#47a248", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "NodeJS", color: "#339933", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "JavaScript", color: "#f7df1e", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "TypeScript", color: "#3178c6", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Docker", color: "#2496ed", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "Git", color: "#f05032", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" }
  ];

  const skillSets = {
    left: ["Frontend", "React", "Vue", "CSS", "HTML"],
    right: ["Backend", "Node.js", "Python", "DevOps", "Database"]
  };

  return (
    <group ref={ref} visible={false}>
      <Suspense fallback={<LoadingFallback />}>
        {/* Lighting - simplified since AnimationManager handles main scene lighting */}
        <fog attach="fog" args={["#0a0a0a", 10, 50]} />
        
        {/* Stars - reduced density to avoid conflicts */}
        <Stars radius={80} depth={40} count={2000} factor={3} fade speed={0.3} />
        
        {/* Binary Tech System - removed auto-rotation, will be controlled externally if needed */}
        <BinarySystem
          radius={6}
          starSize={1}
          skillRadius={2.5}
          skillSets={skillSets}
          techStack={techStack}
          centerTitle="MY TECH STACK"
          position={[0, 0, 0]}
          // Remove any auto-rotation or independent animation props
        />
        
        <Preload all />
      </Suspense>
    </group>
  );
});

SkillsScene.displayName = "SkillsScene";

export default SkillsScene;