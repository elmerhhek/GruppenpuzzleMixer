import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // WICHTIG: Slash am Anfang UND am Ende!
  base: '/GruppenpuzzleMixer/',
})