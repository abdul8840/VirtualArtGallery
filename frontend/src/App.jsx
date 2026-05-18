import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import * as THREE from 'three'

import GalleryScene from '@/components/Gallery/GalleryScene'
import CameraController from '@/components/Controls/CameraController'
import LoadingScreen from '@/components/UI/LoadingScreen'
import WelcomeOverlay from '@/components/UI/WelcomeOverlay'
import ArtworkModal from '@/components/UI/ArtworkModal'
import NavigationHUD from '@/components/UI/NavigationHUD'
import useGalleryStore from '@/stores/galleryStore'
import { useAudioManager } from '@/hooks/useAudioManager'

const GalleryCanvas = () => {
  return (
    <Canvas
      shadows
      camera={{
        fov: 75,
        near: 0.1,
        far: 500,           // ✅ increased from 100
        position: [0, 2.2, 10],
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.8,   // ✅ increased from 1.2
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: 'high-performance',
      }}
      performance={{ min: 0.5 }}
      dpr={[1, 2]}
    >
      <CameraController />
      <Suspense fallback={null}>
        <GalleryScene />
      </Suspense>
    </Canvas>
  )
}

function App() {
  const { setIsLoading, setLoadingProgress } = useGalleryStore()
  useAudioManager()

  const { progress } = useProgress()

  useEffect(() => {
    setLoadingProgress(progress)
    if (progress === 100) {
      const delay = setTimeout(() => setIsLoading(false), 800)
      return () => clearTimeout(delay)
    }
  }, [progress, setLoadingProgress, setIsLoading])

  return (
    <div className="app-root">
      <LoadingScreen />
      <WelcomeOverlay />
      <GalleryCanvas />
      <ArtworkModal />
      <NavigationHUD />
    </div>
  )
}

export default App