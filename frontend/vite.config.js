import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true, // Listen on all addresses including LAN and localhost
    hmr: {
      overlay: true, // Show errors as overlay in browser
    },
    watch: {
      usePolling: true, // Enable polling for file changes (useful on Windows)
      interval: 100, // Check for changes every 100ms
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    force: true, // Force dependency optimization on server start
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
