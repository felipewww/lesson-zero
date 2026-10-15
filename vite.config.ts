import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Caminhos relativos: o GitHub Pages publica em /lesson-zero/, não na raiz do domínio
  base: './',
  plugins: [vue()],
})
