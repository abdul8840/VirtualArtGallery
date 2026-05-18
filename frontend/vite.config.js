import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  define: {
    global: 'globalThis',
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  optimizeDeps: {
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'buffer',
    ],
    exclude: ['@react-three/postprocessing'],
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          fiber: ['@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion', 'gsap'],
        },
      },
    },
  },
})