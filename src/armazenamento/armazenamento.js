/**
 * ARMAZENAMENTO · Único lugar do código que lê e escreve no localStorage (UC13 / HU13).
 *
 * Se o navegador bloquear o localStorage (modo anônimo, por exemplo), o jogo continua
 * funcionando: só não guarda nada.
 *
 * Quem usa: hooks/usePartida.js, hooks/useTema.js, telas/*
 */

const PREFIXO = 'elementar118:';

const CHAVES = {
  ranking: `${PREFIXO}ranking`,         // lista de resultados de todas as partidas
  conquistas: `${PREFIXO}conquistas`,   // { idDaConquista: dataIso }
  jogador: `${PREFIXO}jogador`,         // último nome usado
  ultimaPartida: `${PREFIXO}ultima`,    // id do último resultado (destaque no ranking)
  tema: `${PREFIXO}tema`,               // 'escuro' | 'claro'
};

// ===== 1. LEITURA E ESCRITA BÁSICAS =====

function ler(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave);
    return texto === null ? padrao : JSON.parse(texto);
  } catch {
    return padrao;
  }
}

function escrever(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // sem armazenamento disponível: segue o jogo sem salvar
  }
}

// ===== 2. RANKING (UC13 Salvar resultado) =====

export function carregarResultados() {
  const lista = ler(CHAVES.ranking, []);
  return Array.isArray(lista) ? lista : [];
}

export function salvarResultado(resultado) {
  escrever(CHAVES.ranking, [...carregarResultados(), resultado]);
  escrever(CHAVES.ultimaPartida, resultado.id);
}

export function carregarUltimaPartida() {
  return ler(CHAVES.ultimaPartida, null);
}

// ===== 3. CONQUISTAS (UC12) =====

/** Devolve { idDaConquista: dataIso } com tudo que já foi desbloqueado. */
export function carregarConquistas() {
  const objeto = ler(CHAVES.conquistas, {});
  return objeto && typeof objeto === 'object' && !Array.isArray(objeto) ? objeto : {};
}

export function salvarConquistas(ids, dataIso = new Date().toISOString()) {
  const atuais = carregarConquistas();
  for (const id of ids) {
    if (!atuais[id]) atuais[id] = dataIso;
  }
  escrever(CHAVES.conquistas, atuais);
}

// ===== 4. PREFERÊNCIAS =====

export const carregarJogador = () => ler(CHAVES.jogador, '');
export const salvarJogador = (nome) => escrever(CHAVES.jogador, nome);

export const carregarTema = () => ler(CHAVES.tema, 'escuro');
export const salvarTema = (tema) => escrever(CHAVES.tema, tema);
