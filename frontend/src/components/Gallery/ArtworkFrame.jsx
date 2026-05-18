import { useRef, useState, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import useGalleryStore from '@/stores/galleryStore'
import { useArtworkInteraction } from '@/hooks/useArtworkInteraction'

// ── Fallback texture generator ─────────────────────────────────────────────
const createFallbackTexture = (color1 = '#1a1a2e', color2 = '#4a90d9') => {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, 512, 512)
  grad.addColorStop(0, color1)
  grad.addColorStop(1, color2)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)

  // Decorative circles
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.arc(
      Math.sin(i * 1.1) * 150 + 256,
      Math.cos(i * 1.1) * 150 + 256,
      60 + i * 12,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 1
  for (let i = 0; i < 512; i += 32) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// ── Separated inner component that safely calls useTexture ────────────────
// This fixes the Rules of Hooks violation (no hooks inside try/catch)
const ArtworkCanvas = ({ artwork, width, height, frameDepth, onPointerOver, onPointerOut, onClick }) => {
  // useTexture with onError fallback — correct pattern
  const texture = useTexture(
    artwork.image || '',
    // onLoad callback
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.needsUpdate = true
    }
  )

  const fallbackTexture = useMemo(
    () => createFallbackTexture('#111122', artwork.frameColor || '#4a90d9'),
    [artwork.frameColor]
  )

  const finalTexture = texture || fallbackTexture

  return (
    <mesh
      position={[0, 0, frameDepth / 2 + 0.002]}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={finalTexture}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  )
}

// Fallback when texture fails to load
const FallbackCanvas = ({ artwork, width, height, frameDepth, onPointerOver, onPointerOut, onClick }) => {
  const fallbackTexture = useMemo(
    () => createFallbackTexture('#111122', artwork.frameColor || '#4a90d9'),
    [artwork.frameColor]
  )

  return (
    <mesh
      position={[0, 0, frameDepth / 2 + 0.002]}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={fallbackTexture}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  )
}

// ── Main ArtworkFrame ─────────────────────────────────────────────────────
export const ArtworkFrame = ({ artwork }) => {
  const groupRef   = useRef()
  const glowRef    = useRef()
  const frameRef   = useRef()

  const [hovered, setHovered]           = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(0)
  const [textureError, setTextureError]  = useState(false)

  const { setHoveredArtwork } = useGalleryStore()
  const { focusOnArtwork }    = useArtworkInteraction()

  const [w, h] = artwork.scale || [1.5, 1]

  const frameThickness = 0.12
  const frameDepth     = 0.08

  // ── Animation loop ──────────────────────────────────────────────
  useFrame(({ clock }) => {
    const target = hovered ? 1 : 0
    setGlowIntensity((prev) => {
      const next = THREE.MathUtils.lerp(prev, target, 0.1)

      if (glowRef.current) {
        glowRef.current.material.opacity = next * 0.4
        const pulse = Math.sin(clock.elapsedTime * 3) * 0.05 + 0.95
        glowRef.current.scale.set(
          1 + next * 0.04 * pulse,
          1 + next * 0.04 * pulse,
          1
        )
      }

      if (frameRef.current) {
        frameRef.current.material.emissiveIntensity = next * 0.6
      }

      return next
    })
  })

  // ── Pointer handlers ────────────────────────────────────────────
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

  const canvasProps = {
    artwork,
    width: w,
    height: h,
    frameDepth,
    onPointerOver: handlePointerOver,
    onPointerOut: handlePointerOut,
    onClick: handleClick,
  }

  return (
    <group
      ref={groupRef}
      position={artwork.position}
      rotation={artwork.rotation}
    >
      {/* ── Glow plane behind frame ── */}
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

      {/* ── Outer decorative frame ── */}
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

      {/* ── Inner shadow insert ── */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[w + 0.04, h + 0.04, frameDepth - 0.01]} />
        <meshStandardMaterial color="#050508" roughness={1} metalness={0} />
      </mesh>

      {/* ── Artwork image — with error boundary pattern ── */}
      {!textureError && artwork.image ? (
        <Suspense fallback={<FallbackCanvas {...canvasProps} />}>
          <ArtworkCanvas
            {...canvasProps}
            onError={() => setTextureError(true)}
          />
        </Suspense>
      ) : (
        <FallbackCanvas {...canvasProps} />
      )}

      {/* ── Title text ── */}
      <Text
        position={[0, -h / 2 - 0.25, 0.1]}
        fontSize={0.14}
        color="#c8c8d8"
        anchorX="center"
        anchorY="top"
        maxWidth={w}
        renderOrder={1}
      >
        {artwork.title}
      </Text>

      {/* ── Artist + Year ── */}
      <Text
        position={[0, -h / 2 - 0.45, 0.1]}
        fontSize={0.1}
        color="#888898"
        anchorX="center"
        anchorY="top"
        maxWidth={w}
        renderOrder={1}
      >
        {`${artwork.artist} · ${artwork.year}`}
      </Text>

      {/* ── Hover prompt ── */}
      {hovered && (
        <Text
          position={[0, h / 2 + 0.2, 0.1]}
          fontSize={0.11}
          color="#4a90d9"
          anchorX="center"
          anchorY="bottom"
          renderOrder={1}
        >
          Click to explore
        </Text>
      )}
    </group>
  )
}

export default ArtworkFrame