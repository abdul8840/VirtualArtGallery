import { motion, AnimatePresence } from 'framer-motion'
import useGalleryStore from '@/stores/galleryStore'

export const WelcomeOverlay = () => {
  const { showWelcome, enterGallery, setAudioEnabled } = useGalleryStore()

  const handleEnter = () => {
    setAudioEnabled(true)
    enterGallery()

    if (document.body.requestPointerLock) {
      document.body.requestPointerLock()
    }
  }

  const handleEnterSilent = () => {
    setAudioEnabled(false)
    enterGallery()

    if (document.body.requestPointerLock) {
      document.body.requestPointerLock()
    }
  }

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          className="welcome-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
        >
          <div className="welcome-backdrop" />

          <motion.div
            className="welcome-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          >
            <div className="welcome-eyebrow">WELCOME TO</div>

            <h1 className="welcome-title">
              <span className="welcome-title-main">NEXUS</span>
              <span className="welcome-title-sub">Gallery</span>
            </h1>

            <p className="welcome-description">
              An immersive virtual art experience showcasing{' '}
              <em>contemporary masterpieces</em> from artists around the world.
              Navigate with <kbd>W A S D</kbd> and explore each artwork.
            </p>

            <div className="welcome-controls-guide">
              <div className="control-item">
                <span className="control-key">W A S D</span>
                <span className="control-desc">Move</span>
              </div>
              <div className="control-item">
                <span className="control-key">Mouse</span>
                <span className="control-desc">Look around</span>
              </div>
              <div className="control-item">
                <span className="control-key">Click</span>
                <span className="control-desc">View artwork</span>
              </div>
              <div className="control-item">
                <span className="control-key">ESC</span>
                <span className="control-desc">Exit focus</span>
              </div>
            </div>

            <div className="welcome-buttons">
              <motion.button
                className="btn-enter"
                onClick={handleEnter}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Enter Gallery
                <span className="btn-icon">🎵</span>
              </motion.button>

              <motion.button
                className="btn-enter-silent"
                onClick={handleEnterSilent}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Enter Silently
              </motion.button>
            </div>

            <p className="welcome-fine-print">
              Best experienced with headphones · Desktop recommended
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WelcomeOverlay