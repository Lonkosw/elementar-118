/**
 * LÓGICA · A partida (UC02, UC04, UC05, UC06, UC07, UC08, UC09).
 *
 * Tudo aqui são funções puras: recebem o estado da partida e devolvem um estado novo,
 * sem tocar no React nem no navegador. Isso deixa as regras fáceis de ler e de testar.
 * O hook hooks/usePartida.js só liga estas funções à tela.
 *
 * Estado de uma partida:
 *   id               número que identifica a partida
 *   jogador          nome digitado
 *   dificuldade      'facil' | 'normal' | 'dificil'
 *   tempoTotal       segundos da dificuldade
 *   tempoRestante    segundos que faltam
 *   status           'andamento' | 'pausado' | 'vitoria' | 'derrota'
 *   motivoFim        null | 'completou' | 'tempo' | 'desistencia'
 *   encontrados      números atômicos já acertados (em ordem)
 *   registroAcertos  [{ numero, segundos }]  quando cada acerto aconteceu
 *   erros            quantas respostas "não existe"
 *   resposta         resultado da última resposta (para as mensagens da tela)
 *   conquistasJaDesbloqueadas  conquistas que o jogador já tinha antes da partida
 *   conquistasNovas  conquistas desbloqueadas nesta partida
 */
import { TOTAL_ELEMENTOS } from '../dados/elementos.js';
import { DIFICULDADE_PADRAO, buscarDificuldade } from '../dados/dificuldades.js';
import { validarResposta, normalizar } from './validarResposta.js';
import { subiuDeNivel, nivelDosAcertos } from './placar.js';
import { verificarConquistas } from './conquistas.js';

// ===== 1. INICIAR (UC02 inclui UC03: toda partida tem uma dificuldade) =====

export function criarPartida({
  id = Date.now(),
  jogador,
  dificuldade = DIFICULDADE_PADRAO,
  conquistasJaDesbloqueadas = [],
}) {
  const nivelEscolhido = buscarDificuldade(dificuldade);
  return {
    id,
    jogador,
    dificuldade: nivelEscolhido.id,
    tempoTotal: nivelEscolhido.segundos,
    tempoRestante: nivelEscolhido.segundos,
    status: 'andamento',
    motivoFim: null,
    encontrados: [],
    registroAcertos: [],
    erros: 0,
    resposta: null,
    conquistasJaDesbloqueadas,
    conquistasNovas: [],
  };
}

export const partidaEncerrada = (partida) =>
  partida.status === 'vitoria' || partida.status === 'derrota';

export const tempoUsado = (partida) => partida.tempoTotal - partida.tempoRestante;

// ===== 2. RESPONDER (UC04 inclui UC05, que inclui UC06) =====

export function responder(partida, texto) {
  if (partida.status !== 'andamento') return partida;
  if (normalizar(texto) === '') return partida; // campo vazio não conta

  // UC05 · Validar resposta
  const validacao = validarResposta(texto, partida.encontrados);
  const numeroDaResposta = (partida.resposta?.numeroDaResposta ?? 0) + 1;
  let proxima = { ...partida };

  if (validacao.tipo === 'acertou') {
    // UC06 · Atualizar placar: soma o acerto e guarda quando aconteceu
    proxima.encontrados = [...partida.encontrados, validacao.elemento.numero];
    proxima.registroAcertos = [
      ...partida.registroAcertos,
      { numero: validacao.elemento.numero, segundos: tempoUsado(partida) },
    ];
  } else if (validacao.tipo === 'inexistente') {
    proxima.erros = partida.erros + 1;
  }

  proxima.resposta = {
    numeroDaResposta,
    tipo: validacao.tipo,
    elemento: validacao.elemento ?? null,
    subiuNivel: validacao.tipo === 'acertou' && subiuDeNivel(proxima.encontrados.length),
    nivel: nivelDosAcertos(proxima.encontrados.length),
    conquistas: [],
  };

  // UC12 (extend de UC05): confere se o acerto completou alguma conquista
  proxima = registrarConquistas(proxima, true);

  // Tabela completa: vitória (UC09)
  if (proxima.encontrados.length === TOTAL_ELEMENTOS) {
    return encerrar(proxima, 'vitoria', 'completou');
  }
  return proxima;
}

/** Soma as conquistas novas ao estado (e à mensagem da última resposta, se pedido). */
function registrarConquistas(partida, naResposta) {
  const novas = verificarConquistas(partida);
  if (novas.length === 0) return partida;
  const proxima = { ...partida, conquistasNovas: [...partida.conquistasNovas, ...novas] };
  if (naResposta && proxima.resposta) {
    proxima.resposta = { ...proxima.resposta, conquistas: novas };
  }
  return proxima;
}

// ===== 3. TEMPO (UC04 termina quando o tempo zera) =====

/** Passa 1 segundo. Quando o tempo zera, a partida termina como derrota. */
export function passarSegundo(partida) {
  if (partida.status !== 'andamento') return partida;
  const restante = partida.tempoRestante - 1;
  const proxima = { ...partida, tempoRestante: restante };
  return restante <= 0 ? encerrar(proxima, 'derrota', 'tempo') : proxima;
}

// ===== 4. PAUSA (UC07 estende UC04) =====

export function pausar(partida) {
  return partida.status === 'andamento' ? { ...partida, status: 'pausado' } : partida;
}

export function continuar(partida) {
  return partida.status === 'pausado' ? { ...partida, status: 'andamento' } : partida;
}

// ===== 5. DESISTIR (UC08 estende UC04) =====

export function desistir(partida) {
  if (partida.status !== 'andamento' && partida.status !== 'pausado') return partida;
  return encerrar(partida, 'derrota', 'desistencia');
}

// ===== 6. ENCERRAR (UC09) =====

function encerrar(partida, status, motivoFim) {
  const encerrada = { ...partida, status, motivoFim };
  return registrarConquistas(encerrada, false); // conquistas que dependem do fim (ex.: Sem errar)
}

/** Elementos que o jogador não acertou (destacados na tabela quando perde). */
export function elementosFaltantes(partida, todos) {
  return todos.filter((e) => !partida.encontrados.includes(e.numero));
}

/** Resumo da partida pronto para ser salvo no ranking (UC13). */
export function montarResultado(partida, dataIso = new Date().toISOString()) {
  return {
    id: String(partida.id),
    jogador: partida.jogador,
    acertos: partida.encontrados.length,
    tempoUsado: tempoUsado(partida),
    dificuldade: partida.dificuldade,
    venceu: partida.status === 'vitoria',
    data: dataIso,
  };
}
