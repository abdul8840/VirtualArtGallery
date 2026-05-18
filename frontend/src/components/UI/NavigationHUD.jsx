import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useGalleryStore from '@/stores/galleryStore'

export const NavigationHUD = () => {
  const {
    galleryEntered,
    isModalOpen,
    audioEnabled,
    setAudioEnabled,
    audioVolume,
    setAudioVolume,
    hoveredArtwork,
  } = useGalleryStore()

  const [showControls, setShowControls] = useState(false)

  if (!galleryEntered || isModalOpen) return null

  return (
    <div className="navigation-hud">
      {/* Top left - Gallery name */}
      <motion.div
        className="hud-gallery-name"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="hud-logo">N</span>
        <div>
          <div className="hud-name">NEXUS Gallery</div>
          <div className="hud-subtitle">Contemporary Art Experience</div>
        </div>
      </motion.div>

      {/* Top right controls */}
      <motion.div
        className="hud-controls"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          className={`hud-btn ${audioEnabled ? 'active' : ''}`}
          onClick={() => setAudioEnabled(!audioEnabled)}
          title={audioEnabled ? 'Mute music' : 'Play music'}
        >
          {audioEnabled ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        <button
          className="hud-btn"
          onClick={() => setShowControls(!showControls)}
          title="Controls"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
          </svg>
        </button>
      </motion.div>

      {/* Center crosshair */}
      <div className="hud-crosshair">
        <div className="crosshair-dot" />
      </div>

      {/* Bottom navigation hint */}
      <motion.div
        className="hud-hint"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="hint-item">
          <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Move
        </div>
        <div className="hint-separator" />
        <div className="hint-item">
          <span>🖱️</span> Look
        </div>
        <div className="hint-separator" />
        <div className="hint-item">
          <span>Click artwork</span> to explore
        </div>
      </motion.div>

      {/* Hover indicator */}
      {hoveredArtwork && (
        <motion.div
          className="hud-hover-indicator"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="hover-dot" />
          Click to view artwork
        </motion.div>
      )}

      {/* Controls guide panel */}
      {showControls && (
        <motion.div
          className="controls-guide"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3>Gallery Controls</h3>
          <div className="guide-item">
            <kbd>W A S D</kbd>
            <span>Walk through gallery</span>
          </div>
          <div className="guide-item">
            <kbd>Mouse</kbd>
            <span>Look around</span>
          </div>
          <div className="guide-item">
            <kbd>Click</kbd>
            <span>Select artwork</span>
          </div>
          <div className="guide-item">
            <kbd>ESC</kbd>
            <span>Close modal / free cursor</span>
          </div>
          <button
            className="guide-close"
            onClick={() => setShowControls(false)}
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default NavigationHUD