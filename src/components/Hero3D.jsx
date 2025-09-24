// src/components/Hero3D.jsx
import { forwardRef, useEffect, useRef, useState, useMemo } from "react"
import { Text3D } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import gsap from "gsap"

const rotatingKeywords = [
  "Full Stack Developer",
  "Android Engineer",
  "Next.js | React.js",
  "Kotlin | Node.js",
  "Cloud & AI Enthusiast",
]

const Hero3D = forwardRef(function Hero3D(props, ref) {
  const text = "PARTH BAJAJ"
  const letters = text.split("")
  const keywordRef = useRef()

  const [displayedText, setDisplayedText] = useState("")

  const { viewport } = useThree()
  const screenWidth = viewport.width

  // === Responsive font sizes ===
  const mainFontSize = screenWidth > 12 ? 1.6 : screenWidth > 5 ? 0.6 : 0.4
  const keywordFontSize = screenWidth > 12 ? 0.55 : screenWidth > 5 ? 0.28 : 0.2
  const letterSpacing = mainFontSize * 1

  const totalWidth = useMemo(
    () => (letters.length - 1) * letterSpacing,
    [letters.length, letterSpacing]
  )
  const startX = -totalWidth / 2

  /* --- Animate name letters on load --- */
  useEffect(() => {
    if (!ref?.current) return
    ref.current.children[0].children.forEach((letterGroup, i) => {
      gsap.fromTo(
        letterGroup.scale,
        { x: 0, y: 0, z: 0 },
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.7,
          delay: i * 0.1,
          ease: "back.out(2)",
        }
      )
      gsap.fromTo(
        letterGroup.position,
        { y: -2 },
        {
          y: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power3.out",
        }
      )
    })
  }, [ref])

  /* --- Typing + deleting effect with GSAP --- */
  useEffect(() => {
    let i = 0
    const loop = () => {
      const word = rotatingKeywords[i]
      gsap.to({}, { duration: 0.3, onComplete: () => typeWord(word) })
    }

    const typeWord = (word) => {
      gsap.to({ j: 0 }, {
        j: word.length,
        duration: word.length * 0.05,
        ease: "none",
        onUpdate: function () {
          setDisplayedText(word.slice(0, Math.floor(this.targets()[0].j)))
        },
        onComplete: () => {
          gsap.to({}, { duration: 1, onComplete: () => deleteWord(word) }) // pause before delete
        }
      })
    }

    const deleteWord = (word) => {
      gsap.to({ j: word.length }, {
        j: 0,
        duration: word.length * 0.03,
        ease: "none",
        onUpdate: function () {
          setDisplayedText(word.slice(0, Math.floor(this.targets()[0].j)))
        },
        onComplete: () => {
          i = (i + 1) % rotatingKeywords.length
          loop()
        }
      })
    }

    loop()
  }, [])

  return (
    <group ref={ref} position={[0, 0, 0]} {...props}>
      {/* Main Name */}
      <group position={[0, 0, 0]}>
        {letters.map((letter, index) => (
          <group key={index} position={[startX + index * letterSpacing, 0, 0]}>
            <Text3D
              font="/Inter-Bold.json"
              size={mainFontSize}
              height={mainFontSize * 0.09}
              curveSegments={15}
              bevelEnabled
              bevelThickness={mainFontSize * 0.06}
              bevelSize={mainFontSize * 0.03}
              bevelOffset={0}
              bevelSegments={2}
            >
              {letter === " " ? "\u00A0" : letter}
              <meshStandardMaterial
                color="#00aaff"
                emissive="#33aaff"
                emissiveIntensity={1.1}
                metalness={0.9}
                roughness={0.2}
              />
            </Text3D>
          </group>
        ))}
      </group>

      {/* Rotating keyword (shifted forward in Z so it's never hidden) */}
      <group ref={keywordRef} position={[-3, -1.2, 0.5]} scale={[1, 1, 1]}>
        <Text3D
          font="/Inter-Bold.json"
          size={keywordFontSize}
          height={keywordFontSize * 0.22}
          curveSegments={12}
        >
          {displayedText}
          <meshStandardMaterial
            color="#ff66cc"
            emissive="#ff33aa"
            emissiveIntensity={0.9}
            metalness={0.6}
            roughness={0.25}
          />
        </Text3D>
      </group>
    </group>
  )
})

export default Hero3D
