import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const categories = {
  Languages: ["JavaScript", "TypeScript", "Kotlin", "C++", "Python"],
  Frontend: ["React.js", "Next.js", "TailwindCSS"],
  Backend: ["Node.js", "MongoDB", "Firebase"],
  Android: ["Kotlin", "MVVM"],
  Specialized: ["Mapbox", "Firebase", "OpenAI API"],
};

const skillDetails = {
  "C++": {
    level: "Advanced",
    projects: "500 DSA Problems Solved",
    description: "Primary language for solving logical and DSA.",
    experience: "3+ years",
  },
  JavaScript: {
    level: "Advanced",
    projects: 15,
    description:
      "Primary language for full-stack development with modern ES6+ features.",
    experience: "3+ years",
  },
  TypeScript: {
    level: "Advanced",
    projects: 4,
    description: "Used for VS Code extension and large-scale applications.",
    experience: "2+ years",
  },
  Kotlin: {
    level: "Advanced",
    projects: 5,
    description: "Primary Android development language with MVVM architecture.",
    experience: "2+ years",
  },
  Python: {
    level: "Intermediate",
    projects: 6,
    description: "Used for AI/ML integration and geospatial data processing.",
    experience: "1+ years",
  },
  "React.js": {
    level: "Advanced",
    projects: 3,
    description: "Frontend library for building interactive user interfaces.",
    experience: "3+ years",
  },
  "Next.js": {
    level: "Advanced",
    projects: 8,
    description: "Full-stack React framework for production applications.",
    experience: "2+ years",
  },
  "Node.js": {
    level: "Advanced",
    projects: 10,
    description:
      "Backend runtime for scalable REST APIs and real-time applications.",
    experience: "3+ years",
  },
  MongoDB: {
    level: "Intermediate",
    projects: 6,
    description: "NoSQL database for flexible data storage and retrieval.",
    experience: "2+ years",
  },
  Firebase: {
    level: "Advanced",
    projects: 5,
    description:
      "Google's platform for authentication, real-time database, and hosting.",
    experience: "2+ years",
  },
  "Google Cloud": {
    level: "Intermediate",
    projects: 3,
    description: "Cloud platform for deploying and scaling applications.",
    experience: "1+ years",
  },
  MVVM: {
    level: "Advanced",
    projects: 4,
    description: "Architectural pattern for clean Android development.",
    experience: "2+ years",
  },
  TailwindCSS: {
    level: "Advanced",
    projects: 8,
    description: "Utility-first CSS framework for rapid UI development.",
    experience: "2+ years",
  },
  Mapbox: {
    level: "Intermediate",
    projects: 2,
    description: "Platform for custom maps and geospatial data visualization.",
    experience: "6 months",
  },
  "OpenAI API": {
    level: "Intermediate",
    projects: 3,
    description:
      "AI integration for chatbots and intelligent coding assistance.",
    experience: "8 months",
  },
};

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState("Languages");
  const [activeSkill, setActiveSkill] = useState(null);
  const [expandedCardPosition, setExpandedCardPosition] = useState(null);
  const cardRef = useRef(null);
  const skillRefs = useRef({});

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setActiveSkill(null);
        setExpandedCardPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      id="skills-section"
      className="scroll-section skills-section relative flex flex-col items-center text-white min-h-screen justify-start pt-24 sm:pt-48"
    >
      {/* Floating Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mt-5 mb-4 sm:mb-10 px-6 py-4 bg-black/30 backdrop-blur-lg border border-cyan-400/30 
        rounded-2xl shadow-[0_0_25px_rgba(0,200,255,0.7)] text-center max-w-xl sm:max-w-2xl"
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-cyan-400 tracking-wide drop-shadow-[0_0_15px_rgba(0,200,255,0.8)]">
          🚀 My Tech Arsenal
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed mt-2">
          Hands-on across frontend, mobile and cloud — I build end-to-end
          systems.
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        {Object.keys(categories).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setActiveSkill(null);
              setExpandedCardPosition(null);
            }}
            className={`px-4 sm:px-6 py-2 rounded-xl font-semibold transition-all duration-300 
            backdrop-blur-md border border-white/20 text-sm sm:text-base
            ${
              activeCategory === cat
                ? "bg-cyan-500/20 text-white shadow-[0_0_20px_rgba(0,200,255,0.8)] scale-105"
                : "bg-black/40 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5 max-w-4xl w-full px-2 sm:px-0">
        {categories[activeCategory].map((skill) => (
          <motion.div
            key={skill}
            ref={el => (skillRefs.current[skill] = el)}
            onClick={(e) => {
              if (activeSkill === skill) {
                setActiveSkill(null);
                setExpandedCardPosition(null);
              } else {
                setActiveSkill(skill);
                const rect = e.currentTarget.getBoundingClientRect();
                setExpandedCardPosition({
                  top: rect.bottom + window.scrollY + 12,
                  left: rect.left ,
                });
              }
            }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 25px rgba(0,200,255,0.8)",
            }}
            className="relative group p-3 sm:p-4 rounded-2xl cursor-pointer
            bg-black/40 backdrop-blur-md border border-white/10 
            shadow-[0_0_20px_rgba(0,200,255,0.3)]
            transition-all duration-300"
          >
            <div className="flex items-center justify-center">
              <span className="text-lg sm:text-xl mr-1 sm:mr-2 group-hover:animate-pulse">
                ⭐
              </span>
              <span className="font-semibold text-sm sm:text-base">{skill}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Skill Card - Moved Outside the Grid */}
      <AnimatePresence>
        {activeSkill && expandedCardPosition && (
          <motion.div
            ref={cardRef}
            key="expanded"
            initial={{ opacity: 0, scale: 0.7, rotateX: -20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotateX: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="
              absolute z-51
              w-[90vw] sm:w-40 
              max-h-[70vh] overflow-y-auto
              bg-gradient-to-br from-cyan-900/80 via-black/90 to-cyan-950/80 
              text-white rounded-xl p-4 sm:p-5 border border-cyan-400/40 
              shadow-[0_0_30px_rgba(0,200,255,0.9)]
            "
            style={{
              top: expandedCardPosition.top,
              left: expandedCardPosition.left,
              transform: "translateX(-50%)",
              maxWidth: "12rem",
            }}
          >
            <h4 className="text-base sm:text-lg font-bold text-cyan-300 drop-shadow-[0_0_15px_rgba(0,200,255,0.8)]">
              {activeSkill}
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              {skillDetails[activeSkill]?.description || "No details available."}
            </p>
            <div className="mt-3 text-xs sm:text-sm space-y-1">
              <p>
                <span className="text-cyan-400">Level:</span>{" "}
                {skillDetails[activeSkill]?.level || "N/A"}
              </p>
              <p>
                <span className="text-cyan-400">Projects:</span>{" "}
                {skillDetails[activeSkill]?.projects || 0}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
