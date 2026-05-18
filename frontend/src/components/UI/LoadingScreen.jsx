import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGalleryStore from '@/stores/galleryStore'

export const LoadingScreen = () => {
  const { isLoading, loadingProgress } = useGalleryStore()
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="loading-screen"
        >
          <div className="loading-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="loading-logo"
            >
              <div className="logo-mark">N</div>
              <div className="logo-text">NEXUS</div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="loading-subtitle"
            >
              Contemporary Art Gallery
            </motion.p>

            <div className="loading-bar-container">
              <motion.div
                className="loading-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
              className="loading-status"
            >
              Preparing gallery environment{dots}
            </motion.p>

            <div className="loading-progress-text">
              {Math.round(loadingProgress)}%
            </div>
          </div>

          <div className="loading-background">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="loading-particle"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                }}
                animate={{
                  y: [null, -20, 0],
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen