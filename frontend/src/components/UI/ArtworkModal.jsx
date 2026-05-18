import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGalleryStore from '@/stores/galleryStore'

export const ArtworkModal = () => {
  const { selectedArtwork, isModalOpen, closeModal } = useGalleryStore()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeModal])

  useEffect(() => {
    if (isModalOpen) {
      document.exitPointerLock?.()
    }
  }, [isModalOpen])

  if (!selectedArtwork) return null

  const artwork = selectedArtwork

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeModal}
          />

          {/* Modal panel */}
          <motion.div
            className="artwork-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="modal-inner">
              {/* Close button */}
              <button className="modal-close" onClick={closeModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              {/* Image section */}
              <div className="modal-image-section">
                <motion.div
                  className="modal-image-wrapper"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="modal-image"
                  />
                  <div className="modal-image-overlay" />
                  <div className="modal-image-label">
                    <span className="category-tag">{artwork.category}</span>
                  </div>
                </motion.div>
              </div>

              {/* Info section */}
              <div className="modal-info-section">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="modal-header">
                    <div className="modal-eyebrow">
                      {artwork.artist} · {artwork.year}
                    </div>
                    <h2 className="modal-title">{artwork.title}</h2>
                  </div>

                  <div className="modal-meta">
                    <div className="meta-item">
                      <span className="meta-label">Medium</span>
                      <span className="meta-value">{artwork.medium}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Dimensions</span>
                      <span className="meta-value">{artwork.dimensions}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Year</span>
                      <span className="meta-value">{artwork.year}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Category</span>
                      <span className="meta-value">{artwork.category}</span>
                    </div>
                  </div>

                  <div className="modal-divider" />

                  <div className="modal-description-section">
                    <h3 className="modal-section-title">About this work</h3>
                    <p className="modal-description">{artwork.description}</p>
                  </div>

                  <div className="modal-artist-section">
                    <div className="artist-avatar">
                      {artwork.artist.charAt(0)}
                    </div>
                    <div className="artist-info">
                      <div className="artist-name">{artwork.artist}</div>
                      <div className="artist-role">Contemporary Artist</div>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button className="modal-btn-primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                      </svg>
                      High-Res Preview
                    </button>
                    <button className="modal-btn-secondary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                      </svg>
                      Share
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ArtworkModal