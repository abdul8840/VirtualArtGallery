import * as THREE from 'three'

// ── Reusable wall mesh ─────────────────────────────────────────────────────
const Wall = ({ position, rotation = [0, 0, 0], size, color = '#1a1a24' }) => (
  <mesh position={position} rotation={rotation} receiveShadow castShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={0.9} metalness={0.05} />
  </mesh>
)

// ── Ceiling light fixture mesh ─────────────────────────────────────────────
const CeilingFixture = ({ position }) => (
  <group position={position}>
    {/* Housing */}
    <mesh>
      <boxGeometry args={[0.8, 0.05, 0.3]} />
      <meshStandardMaterial color="#2a2a3a" roughness={0.5} metalness={0.6} />
    </mesh>
    {/* Emissive panel */}
    <mesh position={[0, -0.03, 0]}>
      <boxGeometry args={[0.7, 0.01, 0.22]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  </group>
)

// ── Decorative pillar ──────────────────────────────────────────────────────
const Pillar = ({ position }) => (
  <group position={position}>
    {/* Main shaft */}
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[0.2, 0.22, 6, 12]} />
      <meshStandardMaterial color="#1e1e2e" roughness={0.2} metalness={0.6} />
    </mesh>
    {/* Base cap */}
    <mesh position={[0, -2.9, 0]}>
      <cylinderGeometry args={[0.32, 0.32, 0.2, 12]} />
      <meshStandardMaterial
        color="#4a90d9"
        emissive="#4a90d9"
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
    {/* Top cap */}
    <mesh position={[0, 2.9, 0]}>
      <cylinderGeometry args={[0.32, 0.32, 0.2, 12]} />
      <meshStandardMaterial
        color="#4a90d9"
        emissive="#4a90d9"
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  </group>
)

export const GalleryWalls = () => {
  const wallColor = '#13131e'

  return (
    <group>
      {/* ── Ceiling ── */}
      <mesh position={[0, 6, 0]} receiveShadow>
        <boxGeometry args={[22, 0.3, 22]} />
        <meshStandardMaterial color="#0d0d15" roughness={1} metalness={0} />
      </mesh>

      {/* ── Back wall ── */}
      <Wall position={[0, 3, -11]}   size={[22, 6.3, 0.3]} color={wallColor} />

      {/* ── Front wall with entrance gap ── */}
      <Wall position={[-7, 3, 11]}   size={[8,  6.3, 0.3]} color={wallColor} />
      <Wall position={[7,  3, 11]}   size={[8,  6.3, 0.3]} color={wallColor} />
      <Wall position={[0,  5, 11]}   size={[6,  2.3, 0.3]} color={wallColor} />

      {/* ── Left wall ── */}
      <Wall position={[-11, 3, 0]}   size={[0.3, 6.3, 22]} color={wallColor} />

      {/* ── Right wall ── */}
      <Wall position={[11,  3, 0]}   size={[0.3, 6.3, 22]} color={wallColor} />

      {/* ── Baseboard LED trim ── */}
      {[
        { pos: [0,   0.15, -11], size: [22,  0.3, 0.3] },
        { pos: [-11, 0.15,  0],  size: [0.3, 0.3, 22]  },
        { pos: [11,  0.15,  0],  size: [0.3, 0.3, 22]  },
        { pos: [0,   0.15,  11], size: [22,  0.3, 0.3] },
      ].map(({ pos, size }, i) => (
        <mesh key={`base-${i}`} position={pos}>
          <boxGeometry args={size} />
          <meshStandardMaterial
            color="#4a90d9"
            emissive="#4a90d9"
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}

      {/* ── Crown molding ── */}
      {[
        { pos: [0,   5.85, -11], size: [22,  0.3, 0.3] },
        { pos: [-11, 5.85,  0],  size: [0.3, 0.3, 22]  },
        { pos: [11,  5.85,  0],  size: [0.3, 0.3, 22]  },
        { pos: [0,   5.85,  11], size: [22,  0.3, 0.3] },
      ].map(({ pos, size }, i) => (
        <mesh key={`crown-${i}`} position={pos}>
          <boxGeometry args={size} />
          <meshStandardMaterial color="#2a2a3e" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      {/* ── Ceiling light fixtures ── */}
      {[
        [-5, -4], [-5, 0], [-5, 4],
        [0,  -4], [0,  0], [0,  4],
        [5,  -4], [5,  0], [5,  4],
      ].map(([x, z], i) => (
        <CeilingFixture key={`fix-${i}`} position={[x, 5.92, z]} />
      ))}

      {/* ── Decorative pillars ── */}
      {[
        [-5, -5], [5, -5],
        [-5,  5], [5,  5],
      ].map(([x, z], i) => (
        <Pillar key={`pillar-${i}`} position={[x, 3, z]} />
      ))}
    </group>
  )
}

export default GalleryWalls