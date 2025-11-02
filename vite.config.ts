import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://54.175.243.7:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Mantener /api en el path
      },
      '/oauth': {
        target: 'http://54.175.243.7:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
