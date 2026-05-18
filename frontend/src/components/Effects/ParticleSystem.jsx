import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const ParticleSystem = () => {
  const meshRef = useRef()
  const count = 200

  const { positions, velocities, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18
      positions[i * 3 + 1] = Math.random() * 5.5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18

      velocities[i * 3] = (Math.random() - 0.5) * 0.002
      velocities[i * 3 + 1] = Math.random() * 0.003 + 0.001
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002

      sizes[i] = Math.random() * 0.04 + 0.01
    }

    return { positions, velocities, sizes }
  }, [])

  const posArray = useRef(positions)

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3]
      pos[i * 3 + 1] += velocities[i * 3 + 1]
      pos[i * 3 + 2] += velocities[i * 3 + 2]

      if (pos[i * 3 + 1] > 5.5) {
        pos[i * 3 + 1] = 0
        pos[i * 3] = (Math.random() - 0.5) * 18
        pos[i * 3 + 2] = (Math.random() - 0.5) * 18
      }

      if (Math.abs(pos[i * 3]) > 9) pos[i * 3] *= -0.95
      if (Math.abs(pos[i * 3 + 2]) > 9) pos[i * 3 + 2] *= -0.95
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={posArray.current}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          count={count}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.03}
        transparent
        opacity={0.25}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

export default ParticleSystem