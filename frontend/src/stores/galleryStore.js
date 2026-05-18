import { create } from 'zustand'

const useGalleryStore = create((set, get) => ({
  // State
  selectedArtwork: null,
  hoveredArtwork: null,
  isModalOpen: false,
  isCameraMoving: false,
  cameraTarget: null,
  isFirstPerson: true,
  audioEnabled: false,
  audioVolume: 0.3,
  isLoading: true,
  loadingProgress: 0,
  showWelcome: true,
  galleryEntered: false,
  glowingArtworks: new Set(),
  cameraPosition: [0, 2, 8],
  cameraLookAt: [0, 2, 0],

  // Actions
  setSelectedArtwork: (artwork) =>
    set({
      selectedArtwork: artwork,
      isModalOpen: artwork !== null,
    }),

  setHoveredArtwork: (artworkId) =>
    set({ hoveredArtwork: artworkId }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedArtwork: null,
      isCameraMoving: false,
    }),

  setCameraMoving: (moving) => set({ isCameraMoving: moving }),

  setCameraTarget: (target) => set({ cameraTarget: target }),

  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),

  setAudioVolume: (volume) => set({ audioVolume: volume }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setLoadingProgress: (progress) => set({ loadingProgress: progress }),

  setShowWelcome: (show) => set({ showWelcome: show }),

  enterGallery: () =>
    set({
      showWelcome: false,
      galleryEntered: true,
    }),

  addGlowingArtwork: (id) =>
    set((state) => ({
      glowingArtworks: new Set([...state.glowingArtworks, id]),
    })),

  removeGlowingArtwork: (id) =>
    set((state) => {
      const newSet = new Set(state.glowingArtworks)
      newSet.delete(id)
      return { glowingArtworks: newSet }
    }),

  setCameraPosition: (position) => set({ cameraPosition: position }),
  setCameraLookAt: (lookAt) => set({ cameraLookAt: lookAt }),
  setIsFirstPerson: (fp) => set({ isFirstPerson: fp }),
}))

export default useGalleryStore