import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        v2: path.resolve(__dirname, 'v2.html'),
      },
      output: {
        manualChunks: {
          'vendor-gsap': ['gsap'],
          'vendor-framer': ['framer-motion'],
          'vendor-react': ['react', 'react-dom'],
          'vendor-lenis': ['lenis'],
          'vendor-three': ['three', '@react-three/fiber'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
