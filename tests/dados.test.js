// Confere a integridade dos dados dos 118 elementos (base de HU04, HU05 e HU12).
import { describe, it, expect } from 'vitest';
import { ELEMENTOS, TOTAL_ELEMENTOS, elementoPorNumero } from '../src/dados/elementos.js';
import { DIFICULDADES } from '../src/dados/dificuldades.js';

describe('Dados · 118 elementos (HU04)', () => {
  it('HU04: existem exatamente 118 elementos, numerados de 1 a 118', () => {
    expect(TOTAL_ELEMENTOS).toBe(118);
    expect(ELEMENTOS.map((e) => e.numero)).toEqual(Array.from({ length: 118 }, (_, i) => i + 1));
  });

  it('HU04: símbolos e nomes são únicos', () => {
    expect(new Set(ELEMENTOS.map((e) => e.simbolo)).size).toBe(118);
    expect(new Set(ELEMENTOS.map((e) => e.nome)).size).toBe(118);
  });

  it('HU04: cada elemento ocupa uma casa própria da grade 18 colunas', () => {
    const casas = ELEMENTOS.map((e) => `${e.linha}:${e.coluna}`);
    expect(new Set(casas).size).toBe(118);
    for (const e of ELEMENTOS) {
      expect(e.coluna).toBeGreaterThanOrEqual(1);
      expect(e.coluna).toBeLessThanOrEqual(18);
      expect([1, 2, 3, 4, 5, 6, 7, 9, 10]).toContain(e.linha); // linha 8 é o vão
    }
  });

  it('HU04: posições conhecidas conferem (H, He, Fe, Au, La, Og)', () => {
    const pos = (z) => [elementoPorNumero(z).linha, elementoPorNumero(z).coluna];
    expect(pos(1)).toEqual([1, 1]);
    expect(pos(2)).toEqual([1, 18]);
    expect(pos(26)).toEqual([4, 8]);
    expect(pos(79)).toEqual([6, 11]);
    expect(pos(57)).toEqual([9, 3]);
    expect(pos(118)).toEqual([7, 18]);
  });

  it('HU12: coluna 18 tem os 7 gases nobres e a coluna 1 tem 7 elementos', () => {
    const col18 = ELEMENTOS.filter((e) => e.coluna === 18);
    expect(col18.map((e) => e.simbolo)).toEqual(['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og']);
    expect(ELEMENTOS.filter((e) => e.coluna === 1)).toHaveLength(7);
  });

  it('HU12: 15 lantanídeos (57-71)', () => {
    const la = ELEMENTOS.filter((e) => e.categoria === 'la').map((e) => e.numero);
    expect(la).toEqual(Array.from({ length: 15 }, (_, i) => 57 + i));
  });
});

describe('Dados · dificuldades (HU03)', () => {
  it('HU03: Fácil 15:00, Normal 12:00 e Difícil 10:00', () => {
    const tempos = Object.fromEntries(DIFICULDADES.map((d) => [d.id, d.segundos]));
    expect(tempos).toEqual({ facil: 900, normal: 720, dificil: 600 });
  });
});
