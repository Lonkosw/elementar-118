/**
 * DADOS · Níveis de dificuldade (UC03 / HU03).
 *
 * A dificuldade muda SÓ o tempo da partida. Não há vidas nem pontos.
 * Quem usa: logica/partida.js, telas/NovaPartida.jsx, telas/Ranking.jsx
 */

export const DIFICULDADES = [
  { id: 'facil', nome: 'Fácil', segundos: 15 * 60 },   // 15:00
  { id: 'normal', nome: 'Normal', segundos: 12 * 60 }, // 12:00
  { id: 'dificil', nome: 'Difícil', segundos: 10 * 60 }, // 10:00
];

// A dificuldade que já vem selecionada ao iniciar uma partida.
export const DIFICULDADE_PADRAO = 'normal';

export function buscarDificuldade(id) {
  return DIFICULDADES.find((d) => d.id === id) ?? DIFICULDADES[1];
}
