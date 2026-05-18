import { useEffect, useRef, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useGalleryStore from '@/stores/galleryStore'

export const useGalleryControls = () => {
  const { camera } = useThree()
  const { galleryEntered, isModalOpen } = useGalleryStore()

  const cameraRef = useRef(camera)
  const keys = useRef({})
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const yaw = useRef(0)
  const pitch = useRef(0)
  const isPointerLocked = useRef(false)

  useEffect(() => {
    cameraRef.current = camera
  }, [camera])

  const MOVE_SPEED = 0.08
  const BOUNDARY = 9
  const CAMERA_HEIGHT = 2.2

  const handleKeyDown = useCallback((e) => {
    keys.current[e.code] = true
    if (e.code === 'Space') e.preventDefault()
  }, [])

  const handleKeyUp = useCallback((e) => {
    keys.current[e.code] = false
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isPointerLocked.current || isModalOpen) return
    const sensitivity = 0.002
    yaw.current -= e.movementX * sensitivity
    pitch.current -= e.movementY * sensitivity
    pitch.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch.current))
  }, [isModalOpen])

  const handlePointerLockChange = useCallback(() => {
    isPointerLocked.current = document.pointerLockElement !== null
  }, [])

  useEffect(() => {
    if (!galleryEntered) return

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('pointerlockchange', handlePointerLockChange)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
    }
  }, [galleryEntered, handleKeyDown, handleKeyUp, handleMouseMove, handlePointerLockChange])

  const update = useCallback(() => {
    if (!galleryEntered || isModalOpen) return

    const cam = cameraRef.current
    if (!cam) return

    const euler = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ')
    cam.quaternion.setFromEuler(euler)

    direction.current.set(0, 0, 0)

    if (keys.current['KeyW'] || keys.current['ArrowUp']) direction.current.z -= 1
    if (keys.current['KeyS'] || keys.current['ArrowDown']) direction.current.z += 1
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) direction.current.x -= 1
    if (keys.current['KeyD'] || keys.current['ArrowRight']) direction.current.x += 1

    if (direction.current.length() > 0) {
      direction.current.normalize()
      direction.current.applyEuler(new THREE.Euler(0, yaw.current, 0))
      direction.current.multiplyScalar(MOVE_SPEED)

      const newX = Math.max(-BOUNDARY, Math.min(BOUNDARY, cam.position.x + direction.current.x))
      const newZ = Math.max(-BOUNDARY, Math.min(BOUNDARY, cam.position.z + direction.current.z))

      cam.position.x = newX
      cam.position.z = newZ
    }

    cam.position.y = CAMERA_HEIGHT
  }, [galleryEntered, isModalOpen])

  return { update, yaw, pitch, isPointerLocked }
}

export default useGalleryControls