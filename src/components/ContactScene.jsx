import { forwardRef } from "react"
import TerraformedMoon from "./TerraformedMoon"

const ContactScene = forwardRef((props, ref) => {
  return (
    <group ref={ref} visible={false}>
      <TerraformedMoon />
    </group>
  )
})

export default ContactScene
