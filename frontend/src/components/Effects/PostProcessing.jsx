import { EffectComposer, Bloom, ChromaticAberration, Vignette, SMAA } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export const PostProcessing = ({ isModalOpen }) => {
  return (
    <EffectComposer multisampling={0}>
      <SMAA />
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
        mipmapBlur
        radius={0.7}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0005, 0.0005]}
        radialModulation={false}
        modulationOffset={0.5}
      />
      <Vignette
        offset={0.3}
        darkness={isModalOpen ? 0.85 : 0.55}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}

export default PostProcessing