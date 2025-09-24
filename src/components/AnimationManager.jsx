// src/components/AnimationManager.jsx
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Log = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};


export default function AnimationManager({
  starshipRef,
  hero3DRef,
  geodeRef,
  projectsRef,
  skillsRef,
  contactRef,
  blackHoleRef,
  ringedPlanetRef
}) {
  const { camera } = useThree();
  const timelinesRef = useRef({});
  const stateRef = useRef({
    currentSection: 'hero',
    isTransitioning: false,
    completedSections: new Set()
  });

  useEffect(() => {
    const refs = [
      starshipRef,
      hero3DRef,
      geodeRef,
      projectsRef,
      skillsRef,
      contactRef,
      blackHoleRef,
      ringedPlanetRef
    ];
    
    if (refs.some((r) => !r?.current)) return;

    // Dereference objects
    const ship = starshipRef.current;
    const hero = hero3DRef.current;
    const geode = geodeRef.current;
    const projects = projectsRef.current;
    const skills = skillsRef.current;
    const contact = contactRef.current;
    const blackHole = blackHoleRef.current;
    const ringedPlanet=  ringedPlanetRef.current;

    // Enhanced safe utility functions
    const safe = {
      setVisible(obj, v, log = false) {
        try {
          if (obj && obj.visible !== undefined) {
            obj.visible = !!v;
            if (log) Log(`Setting ${obj.name || 'object'} visible:`, v);
          }
        } catch (e) {
          console.error('Error setting visibility:', e);
        }
      },
      
      setScale(obj, x, y, z) {
        try {
          if (obj && obj.scale) {
            obj.scale.set(x, y, z);
          }
        } catch (e) {
          console.error('Error setting scale:', e);
        }
      },
      
      setPos(obj, x, y, z) {
        try {
          if (obj && obj.position) {
            obj.position.set(x, y, z);
          }
        } catch (e) {
          console.error('Error setting position:', e);
        }
      },
      
      clonePos(obj) {
        try {
          return obj && obj.position ? obj.position.clone() : { x: 0, y: 0, z: 0 };
        } catch (e) {
          return { x: 0, y: 0, z: 0 };
        }
      },
      
      cloneScale(obj) {
        try {
          return obj && obj.scale ? obj.scale.clone() : { x: 1, y: 1, z: 1 };
        } catch (e) {
          return { x: 1, y: 1, z: 1 };
        }
      },
      
      tweenTo(obj, target, options = {}) {
        const defaults = { duration: 1, ease: "power2.inOut" };
        return gsap.to(obj, { ...defaults, ...options, ...target });
      }
    };

    // Store original states for reliable restoration
    const originalStates = {
      ship: {
        pos: safe.clonePos(ship),
        scale: safe.cloneScale(ship),
        visible: true
      },
      hero: {
        pos: safe.clonePos(hero),
        scale: safe.cloneScale(hero),
        visible: true
      },
      geode: {
        pos: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        visible: false
      },
      projects: {
        pos: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        visible: false
      },
      skills: {
        pos: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        visible: false
      },
      contact: {
        pos: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        visible: false
      },
      blackHole: {
        pos: { x: 3, y: 0, z: 0 },
        scale: { x: 0, y: 0, z: 0 },
        visible: false
      },
      ringedPlanet: {
  pos: { x: -8, y: 4, z: 0 },
  scale: { x: 0.5, y: 0.5, z: 0.5 },
  visible: true

},
      camera: {
        pos: safe.clonePos(camera)
      }
    };

    // Starship positions for each section
    const shipPositions = {
      hero: { x: 0, y: 4, z: -10, scale: 2.5 },
      about: { x: -13, y: 4, z: 0, scale: 0.2 },
      projects: { x: -13, y: 4, z: 0, scale: 0.2 },
      skills: { x: -13, y: 4, z: 0, scale: 0.2 },
      contact: { x: -13, y: 4, z: 0, scale: 0.2 }
    };

    // Initialize to hero state
    function initializeState() {
      // Set ship to hero position
      safe.setVisible(ship, true);
      safe.setPos(ship, shipPositions.hero.x, shipPositions.hero.y, shipPositions.hero.z);
      safe.setScale(ship, shipPositions.hero.scale, shipPositions.hero.scale, shipPositions.hero.scale);
      
      // Show hero
      safe.setVisible(hero, true);
      safe.setPos(hero, 0, 0, 0);
      safe.setScale(hero, 1, 1, 1);
      
      safe.setVisible(ringedPlanet, true);
      safe.setPos(ringedPlanet, -12, 5, 0);
      safe.setScale(ringedPlanet, 0.1, 0.1, 0.1);

      // Hide all other objects
      [geode, projects, skills, contact].forEach((obj) => {
        if (!obj) return;
        safe.setVisible(obj, false);
        safe.setScale(obj, 0, 0, 0);
        safe.setPos(obj, 0, 0, 0);
      });
      
      // Hide black hole
      safe.setVisible(blackHole, false);
      safe.setScale(blackHole, 0, 0, 0);
      safe.setPos(blackHole, 16, 0, 0);
      
      stateRef.current.currentSection = 'hero';
      stateRef.current.completedSections.clear();
    }

    // Call initialization
    initializeState();

    // Enhanced timeline creation with proper reverse handling
    function createTransitionTimeline(fromObj, toObj, fromSection, toSection, options = {}) {
      if (!fromObj || !toObj || !blackHole) {
        console.warn('Missing objects for timeline creation');
        return gsap.timeline({ paused: true });
      }

      const tl = gsap.timeline({ 
        paused: true,
        onStart: () => {
          stateRef.current.isTransitioning = true;
          Log(`Starting transition: ${fromSection} → ${toSection}`);
        },
        onComplete: () => {
          stateRef.current.isTransitioning = false;
          stateRef.current.currentSection = toSection;
          stateRef.current.completedSections.add(toSection);
          Log(`Completed transition to ${toSection}`);
        },
        onReverseComplete: () => {
          stateRef.current.isTransitioning = false;
          stateRef.current.currentSection = fromSection;
          stateRef.current.completedSections.delete(toSection);
          Log(`Reversed back to ${fromSection}`);
        }
      });

      const shipFromPos = shipPositions[fromSection];
      const shipToPos = shipPositions[toSection];
      const transitionDuration = options.duration || 1.2;

      // Phase 1: Setup and start black hole opening
      tl.add(() => {
        // Ensure from object is visible at start
        safe.setVisible(fromObj, true);
        safe.setVisible(toObj, false);
        safe.setScale(toObj, 0, 0, 0);
      }, 0);

      // Move starship to new position (remains visible throughout)
      if (shipFromPos && shipToPos) {
        tl.to(ship.position, {
          x: shipToPos.x,
          y: shipToPos.y,
          z: shipToPos.z,
          duration: transitionDuration,
          ease: "power2.inOut"
        }, 0);
        
        tl.to(ship.scale, {
          x: shipToPos.scale,
          y: shipToPos.scale,
          z: shipToPos.scale,
          duration: transitionDuration,
          ease: "power2.inOut"
        }, 0);
      }

      // Phase 2: Black hole opens
      tl.add(() => {
        safe.setVisible(blackHole, true);
      }, 0.1);

      tl.fromTo(blackHole.scale,
        { x: 0, y: 0, z: 0 },
        { 
          x: 1.8, 
          y: 1.8, 
          z: 1.8, 
          duration: 0.8, 
          ease: "power2.out"
        },
        0.15
      );

      // Phase 3: Pull current object into black hole
      tl.to(fromObj.position, {
        x: blackHole.position.x,
        y: blackHole.position.y,
        z: blackHole.position.z - 1,
        duration: 0.9,
        ease: "power2.in"
      }, 0.6);

      tl.to(fromObj.scale, {
        x: 0.01,
        y: 0.01,
        z: 0.01,
        duration: 0.9,
        ease: "power2.in"
      }, 0.6);

      // Optional camera shake
      if (options.cameraShake) {
        tl.to(camera.position, {
          y: originalStates.camera.pos.y - 0.25,
          duration: 0.4,
          ease: "power1.out",
          yoyo: true,
          repeat: 1
        }, 0.8);
      }

      // Phase 4: Black hole closes
      tl.to(blackHole.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.9,
        ease: "power2.inOut"
      }, 1.6);

      // Phase 5: Hide from object and prepare to object
      tl.add(() => {
        safe.setVisible(fromObj, false);
        safe.setPos(fromObj, 0, 0, 0);
        
        // Prepare next object at center
        safe.setPos(toObj, 0, 0, 0);
        safe.setScale(toObj, 0, 0, 0);
        safe.setVisible(toObj, true);
      }, 2.3);

      // Phase 6: Scale in new object
      tl.to(toObj.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.0,
        ease: "back.out(1.7)"
      }, 2.4);

      // Phase 7: Cleanup
      tl.add(() => {
        safe.setVisible(blackHole, false);
        // Ensure final states
        safe.setVisible(fromObj, false);
        safe.setVisible(toObj, true);
      }, 3.5);

      return tl;
    }

    // Special timeline for Hero → About (hero gets eaten, ship moves)
    function createHeroToAboutTimeline() {
      const tl = gsap.timeline({ 
        paused: true,
        onStart: () => {
          stateRef.current.isTransitioning = true;
          Log('Starting Hero → About transition');
        },
        onComplete: () => {
          stateRef.current.isTransitioning = false;
          stateRef.current.currentSection = 'about';
          stateRef.current.completedSections.add('about');
          Log('Completed transition to About');
        },
        onReverseComplete: () => {
          stateRef.current.isTransitioning = false;
          stateRef.current.currentSection = 'hero';
          stateRef.current.completedSections.delete('about');
          Log('Reversed back to Hero');
          
          // Ensure hero is restored
          safe.setVisible(hero, true);
          safe.setPos(hero, 0, 0, 0);
          safe.setScale(hero, 1, 1, 1);
          safe.setVisible(geode, false);
          safe.setScale(geode, 0, 0, 0);
        }
      });

      // Initial state
      tl.add(() => {
        safe.setVisible(hero, true);
        safe.setVisible(geode, false);
        safe.setScale(geode, 0, 0, 0);
      }, 0);

      
      // Move ship to about position
      tl.to(ship.position, {
        x: shipPositions.about.x,
        y: shipPositions.about.y,
        z: shipPositions.about.z,
        duration: 1.2,
        ease: "power2.inOut"
      }, 0);

      tl.to(ship.scale, {
        x: shipPositions.about.scale,
        y: shipPositions.about.scale,
        z: shipPositions.about.scale,
        duration: 1.2,
        ease: "power2.inOut"
      }, 0);

      // Black hole sequence for hero
      tl.add(() => safe.setVisible(blackHole, true), 0.2);
      
      tl.fromTo(blackHole.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1.8, y: 1.8, z: 1.8, duration: 0.8, ease: "power2.out" },
        0.25
      );

      // Pull hero into black hole
      [hero, ringedPlanet].forEach(obj => {
  tl.to(obj.position, { x: blackHole.position.x, y: blackHole.position.y, z: blackHole.position.z - 1, duration: 0.9, ease: "power2.in" }, 0.6);
  tl.to(obj.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 0.9, ease: "power2.in" }, 0.6);
});

      tl.to(hero.scale, {
        x: 0.01,
        y: 0.01,
        z: 0.01,
        duration: 0.9,
        ease: "power2.in"
      }, 0.6);

      // Close black hole
      tl.to(blackHole.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.9,
        ease: "power2.inOut"
      }, 1.6);

      // Hide hero and show geode
      tl.add(() => {
        safe.setVisible(hero, false);
        safe.setPos(hero, 0, 0, 0);
        
        safe.setVisible(geode, true);
        safe.setPos(geode, 0, 0, 0);
        safe.setScale(geode, 0, 0, 0);
      }, 2.3);

      // Scale in geode
      tl.to(geode.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.0,
        ease: "back.out(1.7)"
      }, 2.4);

      // Cleanup
      tl.add(() => {
        safe.setVisible(blackHole, false);
      }, 3.5);

      return tl;
    }

    // Create all timelines
    const timelines = {
      heroToAbout: createHeroToAboutTimeline(),
      aboutToProjects: createTransitionTimeline(geode, projects, 'about', 'projects', { cameraShake: true }),
      projectsToSkills: createTransitionTimeline(projects, skills, 'projects', 'skills'),
      skillsToContact: createTransitionTimeline(skills, contact, 'skills', 'contact', { cameraShake: true })
    };

    // Store timelines in ref for cleanup
    timelinesRef.current = timelines;

    // Enhanced ScrollTrigger creation with better state management
    function createScrollTrigger(trigger, timeline, fromSection, toSection) {
      return ScrollTrigger.create({
        trigger: trigger,
        scroller: "#content-container",
        start: "top center",
        end: "bottom center",
        markers: false, // Set to true for debugging
        
        onEnter: () => {
          if (stateRef.current.isTransitioning) return;
          
          Log(`ScrollTrigger onEnter: ${fromSection} → ${toSection}`);
          
          // Ensure we're in the right state before playing
          if (stateRef.current.currentSection === fromSection) {
            timeline.timeScale(1);
            timeline.play();
          } else {
            console.warn(`State mismatch: expected ${fromSection}, got ${stateRef.current.currentSection}`);
            // Force state correction if needed
            forceStateCorrection(toSection);
          }
        },
        
        onLeaveBack: () => {
          if (stateRef.current.isTransitioning) return;
          
          Log(`ScrollTrigger onLeaveBack: ${toSection} → ${fromSection}`);
          
          // Only reverse if we're in the target section
          if (stateRef.current.currentSection === toSection) {
            timeline.timeScale(1.5); // Faster reverse
            timeline.reverse();
          }
        },
        
        onEnterBack: () => {
          if (stateRef.current.isTransitioning) return;
          
          Log(`ScrollTrigger onEnterBack: returning to ${toSection}`);
          
          // If we've completed this section before, play forward again
          if (stateRef.current.completedSections.has(toSection) && 
              stateRef.current.currentSection === fromSection) {
            timeline.timeScale(1);
            timeline.play();
          }
        },
        
        onLeave: () => {
          // Optional: handle when leaving the trigger area downwards
          Log(`ScrollTrigger onLeave: left ${toSection} area`);
        }
      });
    }

    // Force state correction function for edge cases
    function forceStateCorrection(targetSection) {
      Log(`Force correcting to section: ${targetSection}`);
      
      // Hide all objects first
      [hero, geode, projects, skills, contact].forEach(obj => {
        if (obj) {
          safe.setVisible(obj, false);
          safe.setScale(obj, 0, 0, 0);
        }
      });
      
      // Show the correct object for target section
      const sectionObjects = {
        hero: hero,
        about: geode,
        projects: projects,
        skills: skills,
        contact: contact
      };
      safe.setVisible(ringedPlanet, false);
      const targetObj = sectionObjects[targetSection];
      if (targetObj) {
        safe.setVisible(targetObj, true);
        safe.setPos(targetObj, 0, 0, 0);
        safe.setScale(targetObj, 1, 1, 1);
      }
      
      // Move ship to correct position
      const shipPos = shipPositions[targetSection];
      if (shipPos) {
        safe.setPos(ship, shipPos.x, shipPos.y, shipPos.z);
        safe.setScale(ship, shipPos.scale, shipPos.scale, shipPos.scale);
      }
      
      // Update state
      stateRef.current.currentSection = targetSection;
      safe.setVisible(blackHole, false);
    }

    // Create ScrollTriggers
    const scrollTriggers = [
      createScrollTrigger("#about-section", timelines.heroToAbout, 'hero', 'about'),
      createScrollTrigger("#projects-section", timelines.aboutToProjects, 'about', 'projects'),
      createScrollTrigger("#skills-section", timelines.projectsToSkills, 'projects', 'skills'),
      createScrollTrigger("#contact-section", timelines.skillsToContact, 'skills', 'contact'),
      
      // Special trigger for returning to hero
      ScrollTrigger.create({
        trigger: "#hero-section",
        scroller: "#content-container",
        start: "top 80%",
        end: "bottom 20%",
        
        onEnterBack: () => {
          Log('Returning to Hero section');
          
          // If we're in about section, reverse the hero-to-about timeline
          if (stateRef.current.currentSection === 'about' && !stateRef.current.isTransitioning) {
            timelines.heroToAbout.timeScale(1.5);
            timelines.heroToAbout.reverse();
          }
        },
        
        onEnter: () => {
          // When scrolling down from top, ensure hero state
          if (window.scrollY < 100) {
            initializeState();
          }
        }
      })
    ];

    // Debug helper - log current state periodically
    const debugInterval = setInterval(() => {
      if (stateRef.current.isTransitioning) {
        Log('Current state:', {
          section: stateRef.current.currentSection,
          transitioning: stateRef.current.isTransitioning,
          completed: Array.from(stateRef.current.completedSections)
        });
      }
    }, 2000);

    // Cleanup function
    return () => {
      clearInterval(debugInterval);
      
      // Kill all timelines
      Object.values(timelines).forEach(tl => {
        if (tl) {
          tl.kill();
        }
      });
      
      // Kill all ScrollTriggers
      scrollTriggers.forEach(st => {
        if (st && st.kill) {
          st.kill();
        }
      });
      
      // Kill any remaining ScrollTriggers
      ScrollTrigger.getAll().forEach(st => st.kill());
      
      // Reset to initial state
      initializeState();
    };
  }, [camera]);

  return null;
}
