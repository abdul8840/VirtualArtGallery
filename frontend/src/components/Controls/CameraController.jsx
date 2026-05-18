import { useEffect, useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import useGalleryStore from '@/stores/galleryStore'

export const CameraController = () => {
  const { camera } = useThree()
  const { galleryEntered, isModalOpen } = useGalleryStore()
  const initialized = useRef(false)
  const cameraRef = useRef(null)

  cameraRef.current = camera

  useLayoutEffect(() => {
    if (!initialized.current && cameraRef.current) {
      const cam = cameraRef.current
      cam.position.set(0, 2.2, 10)
      cam.lookAt(0, 2, 0)
      cam.fov = 75
      cam.near = 0.1
      cam.far = 100
      cam.updateProjectionMatrix()
      initialized.current = true
    }
  }, [])

  useEffect(() => {
    if (!galleryEntered || !cameraRef.current) return

    gsap.fromTo(
      cameraRef.current.position,
      { z: 10 },
      {
        z: 8,
        duration: 2,
        ease: 'power2.out',
      }
    )
  }, [galleryEntered])

  return null
}

export default CameraController