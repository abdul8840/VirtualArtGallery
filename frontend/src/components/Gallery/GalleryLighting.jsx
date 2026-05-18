import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'

// Initialize RectAreaLight support
RectAreaLightUniformsLib.init()

// ── Reusable spotlight with properly linked target ─────────────────────────
const GallerySpot = ({
  position,
  targetPosition,
  color = '#fff8f0',
  intensity = 8,
  angle = 0.3,
  distance = 14,
}) => {
  const spotRef   = useRef()
  const targetRef = useRef()

  // ✅ Proper way to link spotlight target in R3F
  useFrame(() => {
    if (spotRef.current && targetRef.current) {
      spotRef.current.target = targetRef.current
      spotRef.current.target.updateMatrixWorld()
    }
  })

  return (
    <>
      <spotLight
        ref={spotRef}
        position={position}
        color={color}
        intensity={intensity}
        angle={angle}
        penumbra={0.8}
        decay={2}
        distance={distance}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />
      {/* Target object the spotlight aims at */}
      <object3D ref={targetRef} position={targetPosition} />
    </>
  )
}

export const GalleryLighting = () => {
  const ambientRef = useRef()

  // Subtle ambient breathing effect
  useFrame(({ clock }) => {
    if (ambientRef.current) {
      ambientRef.current.intensity =
        0.6 + Math.sin(clock.elapsedTime * 0.3) * 0.05  // ✅ increased base from 0.4
    }
  })

  return (
    <group>
      {/* ── Ambient base ── */}
      <ambientLight ref={ambientRef} intensity={0.6} color="#f0e8d8" />

      {/* ── Hemisphere (sky/ground gradient) ── */}
      <hemisphereLight
        args={['#e8f0ff', '#1a1a2e', 0.6]}
      />

      {/* ── Main ceiling spotlights — back wall artworks ── */}
      <GallerySpot position={[0,   5.5, -8]} targetPosition={[0,   1.5, -10]} intensity={14} />
      <GallerySpot position={[-5,  5.5, -8]} targetPosition={[-8,  1.5, -10]} intensity={12} />
      <GallerySpot position={[5,   5.5, -8]} targetPosition={[8,   1.5, -10]} intensity={12} />
      <GallerySpot position={[-3,  5.5, -5]} targetPosition={[-3,  1.5, -10]} intensity={10} />
      <GallerySpot position={[3,   5.5, -5]} targetPosition={[3,   1.5, -10]} intensity={10} />

      {/* ── Left wall spotlights ── */}
      <GallerySpot position={[-8, 5.5, -5]} targetPosition={[-10, 1.5, -5]} intensity={10} />
      <GallerySpot position={[-8, 5.5,  0]} targetPosition={[-10, 1.5,  0]} intensity={10} />
      <GallerySpot position={[-8, 5.5,  5]} targetPosition={[-10, 1.5,  5]} intensity={10} />

      {/* ── Right wall spotlights ── */}
      <GallerySpot position={[8,  5.5, -5]} targetPosition={[10, 1.5, -5]} intensity={10} />
      <GallerySpot position={[8,  5.5,  0]} targetPosition={[10, 1.5,  0]} intensity={10} />
      <GallerySpot position={[8,  5.5,  5]} targetPosition={[10, 1.5,  5]} intensity={10} />

      {/* ── Center fill point lights ── */}
      <pointLight position={[0,  4,  0]}  intensity={4}   color="#e8dcc8" distance={18} decay={2} />
      <pointLight position={[0,  4, -5]}  intensity={3}   color="#e8dcc8" distance={14} decay={2} />
      <pointLight position={[0,  4,  5]}  intensity={2.5} color="#e8dcc8" distance={12} decay={2} />

      {/* ── Accent rim lights (blue tint on walls) ── */}
      <pointLight position={[-10, 1, 0]}  intensity={2} color="#4a90d9" distance={8}  decay={2} />
      <pointLight position={[10,  1, 0]}  intensity={2} color="#4a90d9" distance={8}  decay={2} />
      <pointLight position={[0,   1, -10]} intensity={2} color="#4a90d9" distance={8} decay={2} />
      <pointLight position={[0,   1,  10]} intensity={1.5} color="#4a90d9" distance={6} decay={2} />

      {/* ── Floor wash (RectAreaLight) ── */}
      <rectAreaLight
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={18}
        height={18}
        intensity={1.5}         // ✅ increased from 0.5
        color="#ffffff"
      />
    </group>
  )
}

export default GalleryLighting