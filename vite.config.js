// Configuração do Vite (servidor/build) e do Vitest (testes automáticos).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',          // simula o navegador (localStorage, DOM)
    globals: true,                 // describe/it/expect/afterEach sem import
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}'],
  },
});
