// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      events: 'events/',
      util: 'util/',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {}, // Polyfill empty env object
    process: { env: {} } // Direct process polyfill
  },
});
