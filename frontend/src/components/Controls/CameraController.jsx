import { PointerLockControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function CameraController() {
  const { camera } = useThree()

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  })

  const velocity = new THREE.Vector3()
  const direction = new THREE.Vector3()

  // =========================================
  // GALLERY WALL BOUNDARIES
  // Adjust to your actual gallery size
  // =========================================
  const BOUNDS = {
    minX: -12,
    maxX: 12,
    minZ: -12,
    maxZ: 12,
  }

  useEffect(() => {
    // =====================================
    // SPAWN INSIDE GALLERY
    // =====================================
    camera.position.set(0, 1.8, 5)

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()

      if (keys.current[key] !== undefined) {
        keys.current[key] = true
      }
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()

      if (keys.current[key] !== undefined) {
        keys.current[key] = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [camera])

  useFrame((state, delta) => {
    const speed = 5

    velocity.set(0, 0, 0)

    // =========================
    // MOVEMENT INPUT
    // =========================
    if (keys.current.w) velocity.z -= 1
    if (keys.current.s) velocity.z += 1
    if (keys.current.a) velocity.x -= 1
    if (keys.current.d) velocity.x += 1

    velocity.normalize()

    // Move relative to camera rotation
    velocity.applyQuaternion(camera.quaternion)

    // Prevent flying up/down from camera tilt
    velocity.y = 0

    // Apply speed
    direction.copy(velocity).multiplyScalar(speed * delta)

    // =====================================
    // NEW POSITION
    // =====================================
    const nextX = camera.position.x + direction.x
    const nextZ = camera.position.z + direction.z

    // =====================================
    // WALL COLLISION
    // =====================================
    if (nextX > BOUNDS.minX && nextX < BOUNDS.maxX) {
      camera.position.x = nextX
    }

    if (nextZ > BOUNDS.minZ && nextZ < BOUNDS.maxZ) {
      camera.position.z = nextZ
    }

    // =====================================
    // LOCK PLAYER HEIGHT
    // =====================================
    camera.position.y = 1.8
  })

  return <PointerLockControls />
}