/**
 * LÓGICA · Validação da resposta digitada (UC05 / HU05).
 *
 * Funções puras: não usam React nem o navegador, então são fáceis de testar.
 * Quem usa: logica/partida.js
 */
import { ELEMENTOS } from '../dados/elementos.js';

// ===== 1. NORMALIZAÇÃO DO TEXTO =====

/**
 * Deixa o texto num formato único para comparar:
 * sem acento, sem espaço e em minúsculas ("  Hélio " vira "helio").
 */
export function normalizar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // tira os acentos
    .replace(/[\s-]+/g, '')          // tira espaços e hifens
    .toLowerCase();
}

// ===== 2. ÍNDICE DE NOMES =====
// Mapa "nome normalizado → elemento", montado uma única vez.
// Inclui o nome oficial e todos os sinônimos de cada elemento.
const INDICE_NOMES = new Map();
for (const elemento of ELEMENTOS) {
  for (const nome of [elemento.nome, ...elemento.sinonimos]) {
    INDICE_NOMES.set(normalizar(nome), elemento);
  }
}

// ===== 3. VALIDAÇÃO =====

/**
 * Confere uma resposta e diz o que ela é.
 *
 * @param {string} texto           o que o jogador digitou
 * @param {number[]} encontrados   números atômicos que já estão na tabela
 * @returns {{tipo: 'acertou'|'repetido'|'inexistente', elemento?: object}}
 */
export function validarResposta(texto, encontrados) {
  const elemento = INDICE_NOMES.get(normalizar(texto));

  if (!elemento) return { tipo: 'inexistente' };
  if (encontrados.includes(elemento.numero)) return { tipo: 'repetido', elemento };
  return { tipo: 'acertou', elemento };
}
