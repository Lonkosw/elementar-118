/**
 * LÓGICA · Ranking (UC10 / HU10) e recorde pessoal (HU09).
 *
 * Regra de ordem: mais acertos primeiro; no empate, quem terminou em menos tempo.
 * Um "resultado" tem a forma devolvida por logica/partida.js → montarResultado().
 *
 * Funções puras. Quem usa: hooks/usePartida.js, telas/Ranking.jsx
 */

export const TAMANHO_RANKING = 10;

// ===== 1. ORDEM =====

/** Compara dois resultados: negativo se "a" fica na frente de "b". */
export function compararResultados(a, b) {
  if (b.acertos !== a.acertos) return b.acertos - a.acertos;
  if (a.tempoUsado !== b.tempoUsado) return a.tempoUsado - b.tempoUsado;
  return a.data.localeCompare(b.data); // empate total: o mais antigo fica na frente
}

// ===== 2. TOP 10 POR DIFICULDADE (UC10) =====

export function topPorDificuldade(resultados, dificuldade, limite = TAMANHO_RANKING) {
  return resultados
    .filter((r) => r.dificuldade === dificuldade)
    .sort(compararResultados)
    .slice(0, limite);
}

// ===== 3. RECORDE PESSOAL (HU09: "Novo recorde!") =====

const mesmoJogador = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * true se o resultado é o melhor do jogador naquela dificuldade.
 * Deve ser chamado ANTES de adicionar o resultado à lista.
 */
export function ehNovoRecorde(resultadosAnteriores, novo) {
  if (novo.acertos === 0) return false;
  const doJogador = resultadosAnteriores.filter(
    (r) => r.dificuldade === novo.dificuldade && mesmoJogador(r.jogador, novo.jogador),
  );
  return doJogador.every((r) => compararResultados(novo, r) < 0);
}

// ===== 4. ADICIONAR =====

/** Devolve uma lista nova com o resultado incluído (a original não muda). */
export function adicionarResultado(resultados, novo) {
  return [...resultados, novo];
}
