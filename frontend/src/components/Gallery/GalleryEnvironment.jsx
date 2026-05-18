import { useEffect } from 'react'
import { Environment, Sky } from '@react-three/drei'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export const GalleryEnvironment = () => {
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#0a0a12', 0.025)
    return () => { scene.fog = null }
  }, [scene])

  return (
    <>
      <Environment
        preset="studio"
        environmentIntensity={0.3}
        backgroundIntensity={0}
      />
      <color attach="background" args={['#0a0a12']} />
    </>
  )
}

export default GalleryEnvironment