import { useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import useGalleryStore from '@/stores/galleryStore'

export const useArtworkInteraction = () => {
  const { camera } = useThree()
  const { setSelectedArtwork, setCameraMoving, setCameraTarget } = useGalleryStore()

  const focusOnArtwork = useCallback(
    (artwork) => {
      setCameraMoving(true)

      const artworkPos = new THREE.Vector3(...artwork.position)
      const direction = artworkPos.clone().normalize()

      const viewDistance = 4.5
      const targetPos = artworkPos.clone()

      if (artwork.position[2] < -5) {
        targetPos.z += viewDistance
        targetPos.y = 2.2
      } else if (artwork.position[2] > 5) {
        targetPos.z -= viewDistance
        targetPos.y = 2.2
      } else if (artwork.position[0] < -5) {
        targetPos.x += viewDistance
        targetPos.y = 2.2
      } else if (artwork.position[0] > 5) {
        targetPos.x -= viewDistance
        targetPos.y = 2.2
      }

      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.8,
        ease: 'power3.inOut',
        onComplete: () => {
          setSelectedArtwork(artwork)
          setCameraMoving(false)
        },
      })

      const lookTarget = new THREE.Vector3(...artwork.position)
      lookTarget.y = 2

      const startQuat = camera.quaternion.clone()
      const tempCamera = camera.clone()
      tempCamera.lookAt(lookTarget)
      const endQuat = tempCamera.quaternion.clone()

      gsap.to(
        { t: 0 },
        {
          t: 1,
          duration: 1.8,
          ease: 'power3.inOut',
          onUpdate: function () {
            camera.quaternion.slerpQuaternions(startQuat, endQuat, this.targets()[0].t)
          },
        }
      )
    },
    [camera, setSelectedArtwork, setCameraMoving]
  )

  return { focusOnArtwork }
}