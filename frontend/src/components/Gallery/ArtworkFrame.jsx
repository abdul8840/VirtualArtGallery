import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import useGalleryStore from '@/stores/galleryStore'
import { useArtworkInteraction } from '@/hooks/useArtworkInteraction'

export const ArtworkFrame = ({ artwork }) => {
  const groupRef = useRef()
  const glowRef = useRef()
  const frameRef = useRef()
  const canvasRef = useRef()

  const [hovered, setHovered] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(0)

  const { setHoveredArtwork } = useGalleryStore()
  const { focusOnArtwork } = useArtworkInteraction()

  const [w, h] = artwork.scale

  const texture = useTexture(artwork.image)

  useFrame(({ clock }) => {
    const target = hovered ? 1 : 0
    setGlowIntensity((prev) => THREE.MathUtils.lerp(prev, target, 0.05))

    if (glowRef.current) {
      glowRef.current.material.opacity = glowIntensity * 0.4
      const pulse = Math.sin(clock.elapsedTime * 2) * 0.1 + 0.9
      glowRef.current.scale.set(
        1 + glowIntensity * 0.05 * pulse,
        1 + glowIntensity * 0.05 * pulse,
        1
      )
    }

    if (frameRef.current) {
      frameRef.current.material.emissiveIntensity = glowIntensity * 0.5
    }
  })

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    setHoveredArtwork(artwork.id)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    setHoveredArtwork(null)
    document.body.style.cursor = 'default'
  }

  const handleClick = (e) => {
    e.stopPropagation()
    focusOnArtwork(artwork)
  }

  const frameThickness = 0.12
  const frameDepth = 0.08

  return (
    <group
      ref={groupRef}
      position={artwork.position}
      rotation={artwork.rotation}
    >
      {/* Glow plane behind frame */}
      <mesh ref={glowRef} position={[0, 0, -0.05]}>
        <planeGeometry args={[w + 0.8, h + 0.8]} />
        <meshBasicMaterial
          color={artwork.frameColor || '#4a90d9'}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer frame */}
      <mesh ref={frameRef} castShadow receiveShadow>
        <boxGeometry args={[w + frameThickness * 2, h + frameThickness * 2, frameDepth]} />
        <meshStandardMaterial
          color={artwork.frameColor || '#C9A84C'}
          roughness={0.1}
          metalness={0.9}
          emissive={artwork.frameColor || '#C9A84C'}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Inner frame shadow */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[w + 0.05, h + 0.05, frameDepth - 0.01]} />
        <meshStandardMaterial color="#080808" roughness={1} metalness={0} />
      </mesh>

      {/* Artwork canvas */}
      <mesh
        ref={canvasRef}
        position={[0, 0, frameDepth / 2 + 0.002]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.4}
          metalness={0.0}
          toneMapped={false}
        />
      </mesh>

      {/* Reflection/sheen overlay */}
      <mesh position={[0, 0, frameDepth / 2 + 0.003]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          transparent
          opacity={0.04}
          roughness={0}
          metalness={1}
          color="#ffffff"
          depthWrite={false}
        />
      </mesh>

      {/* Spotlight cone visual */}
      {hovered && (
        <mesh position={[0, h / 2 + 2, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.5, 4, 8, 1, true]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.02}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Artwork title label */}
      <Text
        position={[0, -h / 2 - 0.25, 0.1]}
        fontSize={0.14}
        color="#c8c8d8"
        anchorX="center"
        anchorY="top"
        maxWidth={w}
        font="/fonts/inter-medium.ttf"
      >
        {artwork.title}
      </Text>
      <Text
        position={[0, -h / 2 - 0.45, 0.1]}
        fontSize={0.1}
        color="#888898"
        anchorX="center"
        anchorY="top"
        maxWidth={w}
      >
        {artwork.artist} · {artwork.year}
      </Text>

      {/* Hover interaction hint */}
      {hovered && (
        <Text
          position={[0, h / 2 + 0.2, 0.1]}
          fontSize={0.1}
          color="#4a90d9"
          anchorX="center"
          anchorY="bottom"
        >
          Click to explore
        </Text>
      )}
    </group>
  )
}

export default ArtworkFrame