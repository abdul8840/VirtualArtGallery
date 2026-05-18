import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export const GalleryModel = () => {
  // Load the glb safely from the public folder
  const { scene } = useGLTF('/models/gallery.glb')

  const processedScene = useMemo(() => {
    const clonedScene = scene.clone()
    
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        // Enable high-fidelity real-time shadow configurations
        child.castShadow = true
        child.receiveShadow = true

        // 1. Automatically hide any placeholder canvas elements or frames in the GLB
        // because our interactive React-based components render in their place
        if (
          child.name.startsWith('Artwork_') || 
          child.name.includes('Frame') ||
          child.name.includes('Placeholder')
        ) {
          child.visible = false
          return
        }

        // 2. Map premium modern gallery materials to architectural components
        if (child.name.includes('Floor') || child.name === 'Gallery_Floor') {
          // Keep floor invisible here so our high-performance MeshReflectorMaterial floor displays reflections below
          child.visible = false 
        }

        if (child.name.includes('Wall')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#0e0e16',
            roughness: 0.85,
            metalness: 0.1,
          })
        }

        if (child.name.includes('Pillar')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#1a1a26',
            roughness: 0.15,
            metalness: 0.85,
          })
        }

        if (child.name.includes('LED') || child.name.includes('Strip')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#4a90d9',
            emissive: '#4a90d9',
            emissiveIntensity: 1.5,
          })
        }

        if (child.name.includes('Light_Panel') || child.name.includes('Fixture')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            emissive: '#ffffff',
            emissiveIntensity: 2.0,
          })
        }

        if (child.name.includes('Bench')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#151522',
            roughness: 0.4,
            metalness: 0.3,
          })
        }
      }
    })

    return clonedScene
  }, [scene])

  return <primitive object={processedScene} />
}

// Preload the model in the background
useGLTF.preload('/models/gallery.glb')
export default GalleryModel