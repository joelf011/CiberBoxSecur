import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração do Vite — ativa o plugin React para suporte a JSX e Fast Refresh.
export default defineConfig({
  plugins: [react()],
})
