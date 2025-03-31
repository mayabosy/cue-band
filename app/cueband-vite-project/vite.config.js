import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';  // Import the file system module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cueband/app/',
  server: {
    https: {
      key: fs.readFileSync('/Users/majabosy/.localhost-ssl/localhost-key.pem'),
      cert: fs.readFileSync('/Users/majabosy/.localhost-ssl/localhost.pem'),
    }
  },
});
