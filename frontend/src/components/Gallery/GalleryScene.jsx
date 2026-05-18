import { Suspense } from 'react'
import GalleryModel from './GalleryModel'

export default function GalleryScene() {
  return (
    <>
      <color attach="background" args={['#111']} />

      <ambientLight intensity={2} />

      <directionalLight
        position={[10, 10, 5]}
        intensity={5}
      />

      <Suspense fallback={null}>
        <GalleryModel />
      </Suspense>
    </>
  )
}