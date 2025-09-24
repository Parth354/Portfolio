import { forwardRef } from "react"
import Pulsar from "./Pulsar"
import ProjectMonolith from "./ProjectMonolith"

const ProjectsScene = forwardRef((props, ref) => {
  return (
    <group ref={ref} visible={false}>
      <Pulsar />
      {/* Example monoliths */}
      <ProjectMonolith position={[5, 0, -10]} title="Portfolio" stack="React • Three.js" />
      <ProjectMonolith position={[-8, 2, -12]} title="AI Chatbot" stack="Node.js • OpenAI" />
      <ProjectMonolith position={[0, -5, -15]} title="Data Viz" stack="Python • D3.js" />
    </group>
  )
})

export default ProjectsScene
