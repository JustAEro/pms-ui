import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'

// eslint-disable-next-line import/no-extraneous-dependencies
import legacy from '@vitejs/plugin-legacy'
// eslint-disable-next-line import/no-extraneous-dependencies
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy({targets: ['defaults', 'not IE 11']}), 
    react({babel: {babelrc: true}})
  ],
  resolve: {
    alias: {
      // for TypeScript path alias import like : @/x/y/z
      '@pms-ui': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})