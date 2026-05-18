import * as THREE from 'three'

const Wall = ({ position, rotation, size, color = '#1a1a24' }) => (
  <mesh position={position} rotation={rotation} receiveShadow castShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial
      color={color}
      roughness={0.9}
      metalness={0.05}
    />
  </mesh>
)

const CeilingLight = ({ position }) => (
  <mesh position={position}>
    <boxGeometry args={[0.8, 0.05, 0.3]} />
    <meshBasicMaterial color="#ffffff" />
  </mesh>
)

export const GalleryWalls = () => {
  const wallColor = '#13131e'
  const accentColor = '#1e1e2e'

  return (
    <group>
      {/* Ceiling */}
      <mesh position={[0, 6, 0]} receiveShadow>
        <boxGeometry args={[22, 0.3, 22]} />
        <meshStandardMaterial color="#0d0d15" roughness={1} metalness={0} />
      </mesh>

      {/* Back wall */}
      <Wall
        position={[0, 3, -11]}
        rotation={[0, 0, 0]}
        size={[22, 6.3, 0.3]}
        color={wallColor}
      />

      {/* Front wall with entrance */}
      <Wall
        position={[-7, 3, 11]}
        rotation={[0, 0, 0]}
        size={[8, 6.3, 0.3]}
        color={wallColor}
      />
      <Wall
        position={[7, 3, 11]}
        rotation={[0, 0, 0]}
        size={[8, 6.3, 0.3]}
        color={wallColor}
      />
      <Wall
        position={[0, 5, 11]}
        rotation={[0, 0, 0]}
        size={[6, 2.3, 0.3]}
        color={wallColor}
      />

      {/* Left wall */}
      <Wall
        position={[-11, 3, 0]}
        rotation={[0, 0, 0]}
        size={[0.3, 6.3, 22]}
        color={wallColor}
      />

      {/* Right wall */}
      <Wall
        position={[11, 3, 0]}
        rotation={[0, 0, 0]}
        size={[0.3, 6.3, 22]}
        color={wallColor}
      />

      {/* Baseboard trim - bottom */}
      {[
        [[0, 0.15, -11], [22, 0.3, 0.3]],
        [[-11, 0.15, 0], [0.3, 0.3, 22]],
        [[11, 0.15, 0], [0.3, 0.3, 22]],
        [[0, 0.15, 11], [22, 0.3, 0.3]],
      ].map(([pos, size], i) => (
        <mesh key={`baseboard-${i}`} position={pos}>
          <boxGeometry args={size} />
          <meshStandardMaterial color="#4a90d9" emissive="#4a90d9" emissiveIntensity={0.3} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {/* Crown molding - top */}
      {[
        [[0, 5.85, -11], [22, 0.3, 0.3]],
        [[-11, 5.85, 0], [0.3, 0.3, 22]],
        [[11, 5.85, 0], [0.3, 0.3, 22]],
      ].map(([pos, size], i) => (
        <mesh key={`crown-${i}`} position={pos}>
          <boxGeometry args={size} />
          <meshStandardMaterial color="#2a2a3e" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      {/* Ceiling light fixtures */}
      {[
        [-5, -3], [-5, 0], [-5, 3],
        [0, -3], [0, 0], [0, 3],
        [5, -3], [5, 0], [5, 3],
      ].map(([x, z], i) => (
        <CeilingLight key={`light-${i}`} position={[x, 5.92, z]} />
      ))}

      {/* Decorative pillars */}
      {[
        [-5, -5], [5, -5],
        [-5, 5], [5, 5],
      ].map(([x, z], i) => (
        <group key={`pillar-${i}`} position={[x, 3, z]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.22, 6, 8]} />
            <meshStandardMaterial
              color="#1e1e2e"
              roughness={0.2}
              metalness={0.6}
            />
          </mesh>
          <mesh position={[0, -2.9, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
            <meshStandardMaterial color="#4a90d9" emissive="#4a90d9" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0, 2.9, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
            <meshStandardMaterial color="#4a90d9" emissive="#4a90d9" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default GalleryWalls