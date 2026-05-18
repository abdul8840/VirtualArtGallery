import { Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerformanceMonitor, AdaptiveDpr } from '@react-three/drei'

import GalleryEnvironment from './GalleryEnvironment'
import GalleryFloor from './GalleryFloor'
import GalleryLighting from './GalleryLighting'
import GalleryModel from './GalleryModel'
import ArtworkFrame from './ArtworkFrame'
import ParticleSystem from '@/components/Effects/ParticleSystem'
import PostProcessing from '@/components/Effects/PostProcessing'
import { useGalleryControls } from '@/hooks/useGalleryControls'

import { ARTWORKS } from '@/data/artworks'
import useGalleryStore from '@/stores/galleryStore'

const ControlsUpdater = () => {
  const { update } = useGalleryControls()
  useFrame(() => update())
  return null
}

export const GalleryScene = () => {
  const { isModalOpen } = useGalleryStore()

  return (
    <>
      <AdaptiveDpr pixelated />
      <PerformanceMonitor>
        <GalleryEnvironment />
        <GalleryLighting />

        {/* 1. Real-time reflective floor */}
        <GalleryFloor />

        {/* 2. Load your custom Blender GLB architecture safely */}
        <Suspense fallback={null}>
          <GalleryModel />
        </Suspense>

        {/* 3. Load interactive artwork canvases */}
        {ARTWORKS.map((artwork) => (
          <Suspense key={artwork.id} fallback={null}>
            <ArtworkFrame artwork={artwork} />
          </Suspense>
        ))}

        <ParticleSystem />
        <PostProcessing isModalOpen={isModalOpen} />
        <ControlsUpdater />
      </PerformanceMonitor>
    </>
  )
}

export default GalleryScene