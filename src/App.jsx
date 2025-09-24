import React, { useState, lazy, Suspense } from "react";
import "./index.css";

// Lazy-loaded components
const LoaderOverlay = lazy(() => import("./components/LoaderOverlay"));
const CanvasBackground = lazy(() => import("./components/CanvasBackground"));
const Header = lazy(() => import("./components/Header"));
const HeroSection = lazy(() => import("./components/sections/HeroSection"));
const AboutSection = lazy(() => import("./components/sections/AboutSection"));
const ProjectsSection = lazy(() => import("./components/sections/ProjectsSection"));
const SkillsSection = lazy(() => import("./components/sections/SkillsSection"));
const ContactSection = lazy(() => import("./components/sections/ContactSection"));

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
      {/* Loader overlay */}
      <LoaderOverlay show={isLoading} />

      {/* Canvas background */}
      <CanvasBackground isLoading={isLoading} setIsLoading={setIsLoading} />

      {/* Header only appears after loading */}
      {!isLoading && <Header />}

      {/* Main content */}
      <main id="content-container" aria-live="polite">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </Suspense>
  );
}
