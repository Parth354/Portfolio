import React, { useState, useEffect } from "react";
import "../header.css";

export default function SpaceHeader() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    setExpanded(false); // auto close after click
  };

  const links = [
    { id: "about-section", label: "About", icon: "✦" },
    { id: "projects-section", label: "Projects", icon: "◆" },
    { id: "skills-section", label: "Skills", icon: "✧" },
    { id: "contact-section", label: "Contact", icon: "★" }
  ];

  return (
    <header
      className={`space-header ${isScrolled ? "scrolled" : ""} ${
        expanded ? "expanded" : ""
      }`}
      style={{
        transform: `translate(${mousePosition.x * 2}px, ${
          mousePosition.y * 1
        }px)`
      }}
    >
      {/* Logo */}
      <div
        className="logo-container"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="logo-icon">
          🧑‍🚀
          <div className="logo-glow"></div>
          <div className="orbit-ring"></div>
        </div>
      </div>

      {/* Divider */}
      {expanded && <div className="comet-divider"></div>}

      {/* Navigation */}
      <nav className={`nav-constellation ${expanded ? "show" : ""}`}>
        {links.map((link, index) => (
          <button
            key={link.id}
            className="nav-star"
            onClick={() => scrollTo(link.id)}
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            <span className="star-icon">{link.icon}</span>
            <span className="star-label">{link.label}</span>
            <div className="star-glow"></div>
            <div className="constellation-line"></div>
          </button>
        ))}
      </nav>

      <div className="header-aura"></div>
    </header>
  );
}
