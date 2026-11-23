// Preparação comum a todos os testes.
import '@testing-library/jest-dom/vitest';

// Cada teste começa com o localStorage vazio.
// (A limpeza do DOM do React Testing Library é automática com "globals: true".)
afterEach(() => {
  if (typeof localStorage !== 'undefined') localStorage.clear();
});
