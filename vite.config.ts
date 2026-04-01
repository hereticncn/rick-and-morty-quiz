import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://github.com/hereticncn/rick-and-morty-quiz',
  plugins: [vue()],
})
