import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@firebase/firestore') || id.includes('node_modules/firebase/firestore')) {
            return 'vendor-firestore'
          }
          if (id.includes('node_modules/@firebase/auth') || id.includes('node_modules/firebase/auth')) {
            return 'vendor-auth'
          }
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'vendor-firebase'
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
            return 'vendor-gsap'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
        },
      },
    },
  },
})
