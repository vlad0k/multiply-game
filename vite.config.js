import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/multiply-game/', // Измените на '/' если используете username.github.io репозиторий
  server: {
    host: true, // Разрешает доступ с любого хоста
  },
})

