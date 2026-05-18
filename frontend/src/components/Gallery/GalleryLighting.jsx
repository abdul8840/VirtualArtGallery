import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SpotLight = ({ position, target, color = '#fff8f0', intensity = 8 }) => {
  const lightRef = useRef()
  const targetRef = useRef()

  return (
    <>
      <spotLight
        ref={lightRef}
        position={position}
        color={color}
        intensity={intensity}
        angle={0.3}
        penumbra={0.8}
        decay={2}
        distance={12}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
        target-position={target}
      />
      <object3D ref={targetRef} position={target} />
    </>
  )
}

export const GalleryLighting = () => {
  const ambientRef = useRef()

  useFrame(({ clock }) => {
    if (ambientRef.current) {
      ambientRef.current.intensity = 0.4 + Math.sin(clock.elapsedTime * 0.3) * 0.02
    }
  })

  return (
    <group>
      {/* Ambient */}
      <ambientLight ref={ambientRef} intensity={0.4} color="#f0e8d8" />

      {/* Main ceiling lights */}
      <SpotLight position={[0, 5.5, -8]} target={[0, 0, -9]} intensity={12} />
      <SpotLight position={[-5, 5.5, -8]} target={[-8, 2, -10]} intensity={10} />
      <SpotLight position={[5, 5.5, -8]} target={[8, 2, -10]} intensity={10} />
      <SpotLight position={[-3, 5.5, -8]} target={[-3, 2, -10]} intensity={10} />
      <SpotLight position={[3, 5.5, -8]} target={[3, 2, -10]} intensity={10} />

      {/* Side wall lights */}
      <SpotLight position={[-8, 5.5, -5]} target={[-10, 2, -5]} intensity={10} />
      <SpotLight position={[-8, 5.5, 0]} target={[-10, 2, 0]} intensity={10} />
      <SpotLight position={[-8, 5.5, 5]} target={[-10, 2, 5]} intensity={10} />

      <SpotLight position={[8, 5.5, -5]} target={[10, 2, -5]} intensity={10} />
      <SpotLight position={[8, 5.5, 0]} target={[10, 2, 0]} intensity={10} />
      <SpotLight position={[8, 5.5, 5]} target={[10, 2, 5]} intensity={10} />

      {/* Center fill lights */}
      <pointLight position={[0, 4, 0]} intensity={3} color="#e8dcc8" distance={15} decay={2} />
      <pointLight position={[0, 4, -5]} intensity={2} color="#e8dcc8" distance={12} decay={2} />

      {/* Accent rim lights */}
      <pointLight position={[-10, 1, 0]} intensity={1.5} color="#4a90d9" distance={6} decay={2} />
      <pointLight position={[10, 1, 0]} intensity={1.5} color="#4a90d9" distance={6} decay={2} />
      <pointLight position={[0, 1, -10]} intensity={1.5} color="#4a90d9" distance={6} decay={2} />

      {/* Floor accent */}
      <rectAreaLight
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={20}
        height={20}
        intensity={0.5}
        color="#ffffff"
      />
    </group>
  )
}

export default GalleryLighting