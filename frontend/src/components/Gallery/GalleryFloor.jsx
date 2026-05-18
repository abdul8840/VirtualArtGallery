import { useRef } from 'react'
import { MeshReflectorMaterial } from '@react-three/drei'

export const GalleryFloor = () => {
  const floorRef = useRef()

  return (
    <group>
      {/* ── Main reflective floor ── */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        {/* ✅ Increased from 22x22 to match GalleryWalls 22x22 room */}
        <planeGeometry args={[22, 22, 1, 1]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={0.8}
          mixStrength={60}       // ✅ reduced from 80 (was too mirror-like)
          roughness={0.15}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#111118"
          metalness={0.8}
          mirror={0.7}           // ✅ reduced from 0.9
        />
      </mesh>

      {/* ── Floor border LED strips ── */}
      {[-9.5, 9.5].map((x, i) => (
        <mesh
          key={`strip-x-${i}`}
          position={[x, 0.005, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.05, 20]} />
          <meshBasicMaterial
            color="#4a90d9"
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {[-9.5, 9.5].map((z, i) => (
        <mesh
          key={`strip-z-${i}`}
          position={[0, 0.005, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[20, 0.05]} />
          <meshBasicMaterial
            color="#4a90d9"
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

export default GalleryFloor