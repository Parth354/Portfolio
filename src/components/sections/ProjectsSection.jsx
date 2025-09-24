import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";

const categories = ["App", "Web", "ML"];

const projects = {
  App: [
    {
      title: "Cosmic Jewels",
      desc: "Jewelry e-commerce Android app. Published on Google Play.",
      tech: ["Kotlin", "MVVM", "Coroutines", "Firebase"],
      link: "https://play.google.com/store/apps/details?id=com.jewels.cosmic",
    },
    {
      title: "Guardian Wheels",
      desc: "Android-based anti-theft car protection app built with Kotlin.",
      tech: ["Kotlin", "Firebase", "Geo APIs"],
      link: "https://github.com/Parth354/Guardian-Wheels-App",
    },
  ],
  Web: [
    {
      title: "Chain of Thought Geospatial Analyzer",
      desc: "Full-stack Geospatial AI app with Mapbox, Leaflet & Chain of Thought reasoning.",
      tech: ["Next.js", "Celery", "Node.js", "Python"],
      link: "https://github.com/Parth354/COT-Geospatial",
    },
    {
      title: "AI Extension for VS Code",
      desc: "Custom VS Code extension with Gemini, Mistral & OpenAI for intelligent coding help.",
      tech: ["TypeScript", "Node.js", "OpenAI API"],
      link: "https://github.com/Parth354/ai-chat-extension",
    },
    {
      title: "Property Paradise",
      desc: "Modern rental platform with Firebase auth, property listing, and CI/CD on Vercel.",
      tech: ["Next.js", "Firebase", "Tailwind CSS"],
      link: "https://propertyparadise.vercel.app/",
    },
  ],
  ML: [
    {
      title: "LangChain-Playground",
      desc: "Minimal LangChain features like agents, prompt templates, model chaining, and RAGs",
      tech: ["Python", "OpenCV", "AI"],
      link: "https://github.com/Parth354/LangChain-Playground",
    },
    {
      title: "Chatbot",
      desc: "RAG-based conversational AI assistant, live on ISKCON Gurugram site.",
      tech: ["Python", "RAG", "LLMs"],
      link: "https://iskcongurugram.com/",
    },
  ],
};

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("App");

  // Motion variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.9 },
  };

  return (
    <section
      id="projects-section"
      className="scroll-section projects-section relative flex flex-col py-16 px-4"
    >
      <div className="ui-container ui-container--center flex flex-col items-center text-center relative z-10 pb-12">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-cyan-300 drop-shadow-lg">
          💻 Projects
        </h2>
        <p className="text-gray-200 mb-10 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          A showcase of apps, web platforms, and AI experiments I've built.
          Click a project to explore how I solved problems and shipped value.
        </p>

        {/* Project Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="w-full max-w-6xl flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 snap-x snap-mandatory sm:snap-none"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {projects[activeCategory].map((proj) => (
              <motion.a
                key={proj.title}
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={cardVariants}
                className="group min-w-[70%] max-w-xs sm:min-w-0 flex-shrink-0 sm:flex-shrink py-10 px-6 rounded-2xl border border-cyan-400/40 bg-white/5 backdrop-blur-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 transition-transform hover:scale-105 relative overflow-hidden flex flex-col justify-between snap-center"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-cyan-300 flex items-center gap-2">
                    {proj.title}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                  </h3>
                  <p className="text-gray-200 mb-4 text-sm sm:text-base leading-relaxed">
                    {proj.desc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 text-xs sm:text-sm rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Category Selector */}
      <div className="mt-10 flex justify-center">
        <div
          className="flex gap-3 sm:gap-6
                          bg-black/50 backdrop-blur-xl px-4 sm:px-8 py-2 sm:py-3 rounded-full
                          border border-cyan-400/40 shadow-lg shadow-cyan-500/30"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-sm sm:text-base transition-all ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-400/50 scale-105"
                  : "text-cyan-300 hover:text-white hover:bg-cyan-500/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
