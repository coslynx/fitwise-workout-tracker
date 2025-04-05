import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Specify the development server port
  },
  // No explicit build or css configuration needed here for MVP
  // Vite automatically handles PostCSS/Tailwind config files
  // Vite's default build settings are suitable for MVP
  // Vite automatically loads .env variables prefixed with VITE_
});