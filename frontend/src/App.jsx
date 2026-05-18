import { Suspense, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
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
  const { galleryEntered } = useGalleryStore()

  return (
    <Canvas
      shadows
      camera={{
        fov: 75,
        near: 0.1,
        far: 100,
        position: [0, 2.2, 10],
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
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

  useEffect(() => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        setLoadingProgress(100)
        clearInterval(interval)
        setTimeout(() => setIsLoading(false), 600)
      } else {
        setLoadingProgress(progress)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [setIsLoading, setLoadingProgress])

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