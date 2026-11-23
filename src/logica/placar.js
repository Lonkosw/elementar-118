/**
 * LÓGICA · Placar e tempo (UC06 / HU06).
 *
 * Regras do placar:
 *  - não há vidas nem pontos: o placar é o número de acertos (x/118);
 *  - a cada 10 acertos aparece "Subiu de nível!";
 *  - com menos de 1 minuto no relógio o cronômetro muda de cor e aparece um aviso.
 *
 * Quem usa: logica/partida.js, componentes/Placar.jsx, telas/Ranking.jsx
 */

export const ACERTOS_POR_NIVEL = 10;
export const SEGUNDOS_AVISO = 60;

// ===== 1. TEMPO =====

/** Transforma segundos em "MM:SS" (725 → "12:05"). */
export function formatarTempo(segundos) {
  const total = Math.max(0, Math.floor(segundos));
  const minutos = String(Math.floor(total / 60)).padStart(2, '0');
  const resto = String(total % 60).padStart(2, '0');
  return `${minutos}:${resto}`;
}

/** true quando falta menos de 1 minuto (ativa a cor e o aviso do cronômetro). */
export function tempoCritico(segundosRestantes) {
  return segundosRestantes > 0 && segundosRestantes < SEGUNDOS_AVISO;
}

// ===== 2. NÍVEL =====

/** Nível atual: 0 até o 9º acerto, 1 a partir do 10º, e assim por diante. */
export function nivelDosAcertos(acertos) {
  return Math.floor(acertos / ACERTOS_POR_NIVEL);
}

/** true quando ESTE acerto fez o jogador subir de nível (10, 20, 30...). */
export function subiuDeNivel(acertos) {
  return acertos > 0 && acertos % ACERTOS_POR_NIVEL === 0;
}
