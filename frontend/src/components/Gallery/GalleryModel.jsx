import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/models/looniversal-crypto-arvr-art-gallery/source/2/scene.gltf'

export default function GalleryModel() {
  const { scene } = useGLTF(MODEL_PATH)

  useEffect(() => {
    if (!scene) return

    console.log('GLTF LOADED')

    // =========================
    // AUTO CENTER MODEL
    // =========================
    const box = new THREE.Box3().setFromObject(scene)

    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    console.log('SIZE:', size)
    console.log('CENTER:', center)

    scene.position.set(-center.x, -center.y, -center.z)

    // Put floor on ground
    scene.position.y += size.y / 2
    scene.position.y -= 2

    // =========================
    // AUTO SCALE
    // =========================
    const maxAxis = Math.max(size.x, size.y, size.z)

    let scale = 1

    if (maxAxis > 100) scale = 0.01
    else if (maxAxis > 50) scale = 0.03
    else if (maxAxis > 20) scale = 0.08
    else if (maxAxis > 10) scale = 0.2
    else if (maxAxis < 1) scale = 5

    scene.scale.setScalar(scale)

    // =========================
    // FIX MATERIALS/TEXTURES
    // =========================
    scene.traverse((child) => {
      if (!child.isMesh) return

      child.castShadow = true
      child.receiveShadow = true

      if (child.material) {
        child.material.side = THREE.DoubleSide

        // Base Color Texture
        if (child.material.map) {
          child.material.map.colorSpace =
            THREE.SRGBColorSpace

          child.material.map.flipY = false
          child.material.map.needsUpdate = true
        }

        // Emissive
        if (child.material.emissiveMap) {
          child.material.emissiveMap.colorSpace =
            THREE.SRGBColorSpace
        }

        child.material.needsUpdate = true
      }
    })
  }, [scene])

  return <primitive object={scene} />
}

useGLTF.preload(MODEL_PATH)