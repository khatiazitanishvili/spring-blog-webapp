import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost-cert.pem'),
    },
    port: 5173,
    proxy: {
      '^/api/.*': {
        target: 'https://spring-app:8443',
        changeOrigin: true,
        secure: false, // accept self-signed cert
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  }
});
