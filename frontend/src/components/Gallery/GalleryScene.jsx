import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerformanceMonitor, AdaptiveDpr, BakeShadows } from '@react-three/drei'

import GalleryEnvironment from './GalleryEnvironment'
import GalleryFloor from './GalleryFloor'
import GalleryWalls from './GalleryWalls'
import GalleryLighting from './GalleryLighting'
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

        <Suspense fallback={null}>
          <GalleryFloor />
          <GalleryWalls />

          {ARTWORKS.map((artwork) => (
            <ArtworkFrame key={artwork.id} artwork={artwork} />
          ))}

          <ParticleSystem />
        </Suspense>

        <PostProcessing isModalOpen={isModalOpen} />
        <ControlsUpdater />
      </PerformanceMonitor>
    </>
  )
}

export default GalleryScene