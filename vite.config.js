import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '5175-izt25rb8cwxosp77jfzz1-ec71e850.manus.computer'
    ]
  }
})
