import { useEffect, useRef } from 'react'
import useGalleryStore from '@/stores/galleryStore'

export const useAudioManager = () => {
  const audioRef = useRef(null)
  const { audioEnabled, audioVolume, galleryEntered } = useGalleryStore()

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/audio/ambient.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = audioVolume
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return
    if (audioEnabled && galleryEntered) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [audioEnabled, galleryEntered])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume
    }
  }, [audioVolume])

  return audioRef
}