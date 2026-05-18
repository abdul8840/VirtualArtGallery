import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import useGalleryStore from '@/stores/galleryStore'
import { useArtworkInteraction } from '@/hooks/useArtworkInteraction'

// Procedural beautiful fallback gradient texture if image is missing
const createFallbackTexture = (color1 = '#1a1a2e', color2 = '#4a90d9') => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  
  // Base Gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 512)
  grad.addColorStop(0, color1)
  grad.addColorStop(1, color2)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)
  
  // Decorative abstract circles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.arc(
      Math.sin(i) * 150 + 256,
      Math.cos(i) * 150 + 256,
      Math.random() * 80 + 40,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

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

  // Attempt to load texture safely
  let texture
  try {
    texture = useTexture(artwork.image)
  } catch (e) {
    texture = useMemo(() => createFallbackTexture('#111122', artwork.frameColor || '#4a90d9'), [artwork])
  }

  useFrame(({ clock }) => {
    const target = hovered ? 1 : 0
    setGlowIntensity((prev) => THREE.MathUtils.lerp(prev, target, 0.1))

    if (glowRef.current) {
      glowRef.current.material.opacity = glowIntensity * 0.4
      const pulse = Math.sin(clock.elapsedTime * 3) * 0.05 + 0.95
      glowRef.current.scale.set(
        1 + glowIntensity * 0.04 * pulse,
        1 + glowIntensity * 0.04 * pulse,
        1
      )
    }

    if (frameRef.current) {
      frameRef.current.material.emissiveIntensity = glowIntensity * 0.6
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
        <planeGeometry args={[w + 0.6, h + 0.6]} />
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
          roughness={0.15}
          metalness={0.85}
          emissive={artwork.frameColor || '#C9A84C'}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Inner frame shadow insert */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[w + 0.04, h + 0.04, frameDepth - 0.01]} />
        <meshStandardMaterial color="#050508" roughness={1} metalness={0} />
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
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Standard text overlays (omitting external fonts to guarantee instantaneous loading) */}
      <Text
        position={[0, -h / 2 - 0.25, 0.1]}
        fontSize={0.14}
        color="#c8c8d8"
        anchorX="center"
        anchorY="top"
        maxWidth={w}
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

      {hovered && (
        <Text
          position={[0, h / 2 + 0.2, 0.1]}
          fontSize={0.11}
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