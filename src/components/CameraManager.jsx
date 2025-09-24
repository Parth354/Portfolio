// src/components/CameraManager.jsx
import { useLayoutEffect } from "react"
import { useThree } from "@react-three/fiber"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const SECTION_CAMERA_POS = [
  // hero (section 0)
  { pos: { x: 0, y: 2, z: 10 }, lookAt: [0, 0, 0], duration: 1.2 },
  // about (section 1)
  { pos: { x: 0, y: 1.5, z: 8.5 }, lookAt: [0, 0, 0], duration: 1.2 },
  // projects (section 2)
  { pos: { x: 0, y: 1.2, z: 9.5 }, lookAt: [0, 0, 0], duration: 1.2 },
  // skills (section 3)
  { pos: { x: 0, y: 1.2, z: 9.5 }, lookAt: [0, 0, 0], duration: 1.2 },
  // contact (section 4)
  { pos: { x: 0, y: 1.2, z: 9.5 }, lookAt: [0, 0, 0], duration: 1.2 },
]

export default function CameraManager() {
  const { camera } = useThree()

  useLayoutEffect(() => {
    const scroller = document.querySelector("#content-container")
    if (!scroller) {
      console.error("CameraManager: missing #content-container")
      return
    }

    // initial camera placement
    gsap.set(camera.position, { x: 0, y: 2, z: 12 })
    camera.lookAt(0, 0, 0)

    // create a ScrollTrigger per section to animate camera to that section's preset
    const triggers = SECTION_CAMERA_POS.map((cfg, index) => {
      const tl = gsap.timeline({
        paused: true,
      })
      tl.to(camera.position, {
        x: cfg.pos.x,
        y: cfg.pos.y,
        z: cfg.pos.z,
        duration: cfg.duration,
        ease: "power2.inOut",
        onUpdate: () => camera.lookAt(...cfg.lookAt),
      })

      return ScrollTrigger.create({
        trigger: `#content-container`,
        scroller,
        start: () => `${index * 100}% top`,
        end: () => `${(index + 1) * 100}% top`,
        scrub: true,
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.progress(1),
        onLeaveBack: () => tl.progress(0),
      })
    })

    return () => {
      triggers.forEach(t => t.kill())
    }
  }, [camera])

  return null
}
