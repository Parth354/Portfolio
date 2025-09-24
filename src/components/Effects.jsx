import React, { forwardRef, useRef, useImperativeHandle } from "react"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import { LensingEffect } from "./effects/LensingEffect"

// ✅ Forward the lensingRef so parent components (Scene/AnimationManager) can use it
const Effects = forwardRef((props, ref) => {
  const lensingRef = useRef()

  // Expose the inner lensingRef to the parent
  useImperativeHandle(ref, () => ({
    lensing: lensingRef.current,
  }))

  return (
    <EffectComposer>
      <LensingEffect ref={lensingRef} strength={0} radius={0} />
      <Bloom intensity={0.6} mipmapBlur luminanceThreshold={0.8} />
      <Vignette eskil={false} offset={0.1} darkness={0.5} />
    </EffectComposer>
  )
})

export default Effects
