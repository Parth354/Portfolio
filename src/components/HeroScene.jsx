import { forwardRef } from "react"
import Hero3D from "./Hero3D"

const HeroScene = forwardRef((props, ref) => {
  return (
    <group ref={ref}>
      <Hero3D />
    </group>
  )
})

export default HeroScene
