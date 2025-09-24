import { forwardRef } from "react"
import CelestialGeode from "./CelestialGeode"

const AboutScene = forwardRef((props, ref) => {
  return (
    <group ref={ref} visible={false}>
      <CelestialGeode />
    </group>
  )
})

export default AboutScene
