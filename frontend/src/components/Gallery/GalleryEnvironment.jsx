import { useEffect } from 'react'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export const GalleryEnvironment = () => {
  const { scene } = useThree()

  useEffect(() => {
    // Exponential fog — thicker at distance, subtle near camera
    scene.fog = new THREE.FogExp2('#0a0a12', 0.018)  // ✅ reduced from 0.025 (was too heavy)
    return () => {
      scene.fog = null
    }
  }, [scene])

  return (
    <>
      {/* 
        Studio preset = neutral even lighting great for galleries
        environmentIntensity affects how much the HDR lights the scene
      */}
      <Environment
        preset="studio"
        environmentIntensity={0.5}    // ✅ increased from 0.3
        backgroundIntensity={0}       // don't show HDR as background
      />
      <color attach="background" args={['#0a0a12']} />
    </>
  )
}

export default GalleryEnvironment