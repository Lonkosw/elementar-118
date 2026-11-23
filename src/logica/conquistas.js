/**
 * LÓGICA · Condições das conquistas (UC12 / HU12, extra).
 *
 * UC12 "Desbloquear conquista" é uma extensão (<<extend>>) de UC05 "Validar resposta":
 * depois de cada resposta a partida pergunta aqui se alguma conquista foi completada.
 *
 * Funções puras. Quem usa: logica/partida.js
 */
import { ELEMENTOS, TOTAL_ELEMENTOS } from '../dados/elementos.js';
import { CONQUISTAS } from '../dados/conquistas.js';

// ===== 1. AUXILIARES =====

/** true se TODOS os elementos do grupo estão entre os encontrados. */
function completou(grupo, encontrados) {
  return grupo.every((e) => encontrados.includes(e.numero));
}

/** Procura 10 acertos seguidos dentro de 30 segundos (conquista Relâmpago). */
function fezRelampago(registroAcertos) {
  const JANELA = 10;
  for (let i = 0; i + JANELA - 1 < registroAcertos.length; i++) {
    const primeiro = registroAcertos[i].segundos;
    const ultimo = registroAcertos[i + JANELA - 1].segundos;
    if (ultimo - primeiro <= 30) return true;
  }
  return false;
}

// ===== 2. CONDIÇÃO DE CADA CONQUISTA =====
// Cada regra recebe a partida e devolve true/false.
const COLUNA_18 = ELEMENTOS.filter((e) => e.coluna === 18);
const COLUNA_1 = ELEMENTOS.filter((e) => e.coluna === 1);
const LANTANIDEOS = ELEMENTOS.filter((e) => e.categoria === 'la');
const partidaTerminou = (p) => p.status === 'vitoria' || p.status === 'derrota';

const REGRAS = {
  'primeiro-contato': (p) => p.encontrados.length >= 1,
  'gases-nobres': (p) => completou(COLUNA_18, p.encontrados),
  'metais-alcalinos': (p) => completou(COLUNA_1, p.encontrados),
  'relampago': (p) => fezRelampago(p.registroAcertos),
  'sem-erros': (p) => partidaTerminou(p) && p.erros === 0 && p.encontrados.length >= 10,
  'terras-raras': (p) => completou(LANTANIDEOS, p.encontrados),
  'meio-caminho': (p) => p.encontrados.length >= 59,
  'mendeleiev': (p) => p.encontrados.length === TOTAL_ELEMENTOS,
  'mestre': (p) => p.encontrados.length === TOTAL_ELEMENTOS && p.dificuldade === 'dificil',
};

// ===== 3. VERIFICAÇÃO =====

/**
 * Devolve os ids das conquistas que a partida acabou de completar
 * (ignora as que o jogador já tinha antes ou já ganhou nesta partida).
 */
export function verificarConquistas(partida) {
  const jaTem = [...partida.conquistasJaDesbloqueadas, ...partida.conquistasNovas];
  return CONQUISTAS
    .filter((c) => !jaTem.includes(c.id) && REGRAS[c.id](partida))
    .map((c) => c.id);
}
