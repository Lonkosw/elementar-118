// UC10 · Consultar ranking (HU10), recorde (HU09) e UC13 · Salvar resultado (HU13).
import { describe, it, expect } from 'vitest';
import { compararResultados, topPorDificuldade, ehNovoRecorde, adicionarResultado } from '../src/logica/ranking.js';
import {
  carregarResultados, salvarResultado, carregarUltimaPartida,
  carregarConquistas, salvarConquistas, carregarJogador, salvarJogador, carregarTema, salvarTema,
} from '../src/armazenamento/armazenamento.js';

const r = (jogador, acertos, tempoUsado, dificuldade = 'normal', extra = {}) => ({
  id: `${jogador}-${acertos}-${tempoUsado}`, jogador, acertos, tempoUsado, dificuldade,
  venceu: false, data: '2026-11-18T10:00:00.000Z', ...extra,
});

describe('UC10 · Consultar ranking (HU10)', () => {
  it('HU10: ordena por mais acertos', () => {
    const lista = [r('A', 10, 100), r('B', 50, 700), r('C', 30, 50)].sort(compararResultados);
    expect(lista.map((x) => x.jogador)).toEqual(['B', 'C', 'A']);
  });

  it('HU10: no empate de acertos, vence quem usou menos tempo', () => {
    const lista = [r('Lento', 40, 600), r('Rapido', 40, 300)].sort(compararResultados);
    expect(lista.map((x) => x.jogador)).toEqual(['Rapido', 'Lento']);
  });

  it('HU10: cada dificuldade tem o seu próprio ranking', () => {
    const todos = [r('A', 10, 1, 'facil'), r('B', 20, 1, 'normal'), r('C', 30, 1, 'dificil')];
    expect(topPorDificuldade(todos, 'facil').map((x) => x.jogador)).toEqual(['A']);
    expect(topPorDificuldade(todos, 'dificil').map((x) => x.jogador)).toEqual(['C']);
  });

  it('HU10: mostra só o top 10', () => {
    const todos = Array.from({ length: 15 }, (_, i) => r(`J${i}`, i, 10));
    const top = topPorDificuldade(todos, 'normal');
    expect(top).toHaveLength(10);
    expect(top[0].acertos).toBe(14);
  });
});

describe('UC09 · Novo recorde (HU09)', () => {
  it('HU09: o primeiro resultado do jogador na dificuldade é recorde', () => {
    expect(ehNovoRecorde([], r('Ana', 5, 100))).toBe(true);
  });

  it('HU09: só é recorde se superar o melhor anterior do mesmo jogador', () => {
    const antes = [r('Ana', 30, 500), r('Bia', 90, 100)];
    expect(ehNovoRecorde(antes, r('ana', 31, 600))).toBe(true);   // mais acertos (nome sem diferença de caixa)
    expect(ehNovoRecorde(antes, r('Ana', 30, 400))).toBe(true);   // mesmo acerto, menos tempo
    expect(ehNovoRecorde(antes, r('Ana', 29, 100))).toBe(false);
    expect(ehNovoRecorde(antes, r('Ana', 30, 600))).toBe(false);
  });

  it('HU09: partida com 0 acertos nunca é recorde', () => {
    expect(ehNovoRecorde([], r('Ana', 0, 10))).toBe(false);
  });

  it('HU09: recorde considera cada dificuldade separadamente', () => {
    const antes = [r('Ana', 80, 100, 'facil')];
    expect(ehNovoRecorde(antes, r('Ana', 10, 100, 'dificil'))).toBe(true);
  });

  it('adicionarResultado não altera a lista original', () => {
    const lista = [r('A', 1, 1)];
    const nova = adicionarResultado(lista, r('B', 2, 2));
    expect(lista).toHaveLength(1);
    expect(nova).toHaveLength(2);
  });
});

describe('UC13 · Salvar resultado (HU13)', () => {
  it('HU13: o resultado fica salvo no localStorage com todos os campos', () => {
    salvarResultado(r('Ana', 47, 400, 'normal'));
    const [salvo] = carregarResultados();
    expect(salvo).toMatchObject({ jogador: 'Ana', acertos: 47, tempoUsado: 400, dificuldade: 'normal' });
    expect(salvo.data).toBeTruthy();
  });

  it('HU13: os dados continuam lá depois de "fechar o navegador" (ler direto do localStorage)', () => {
    salvarResultado(r('Ana', 47, 400));
    salvarResultado(r('Bia', 10, 100));
    const bruto = JSON.parse(localStorage.getItem('elementar118:ranking'));
    expect(bruto).toHaveLength(2);
    expect(carregarResultados()).toHaveLength(2);
  });

  it('HU10: guarda qual foi a última partida (para destacar no ranking)', () => {
    salvarResultado(r('Ana', 47, 400));
    expect(carregarUltimaPartida()).toBe('Ana-47-400');
  });

  it('HU13: dado corrompido no localStorage não quebra o jogo', () => {
    localStorage.setItem('elementar118:ranking', '{isso nao e json');
    expect(carregarResultados()).toEqual([]);
    localStorage.setItem('elementar118:ranking', '"texto"');
    expect(carregarResultados()).toEqual([]);
  });
});

describe('Armazenamento · conquistas e preferências', () => {
  it('HU12: a conquista fica salva e não é regravada com data nova', () => {
    salvarConquistas(['gases-nobres'], '2026-01-01T00:00:00.000Z');
    salvarConquistas(['gases-nobres', 'mendeleiev'], '2026-02-02T00:00:00.000Z');
    expect(carregarConquistas()).toEqual({
      'gases-nobres': '2026-01-01T00:00:00.000Z',
      mendeleiev: '2026-02-02T00:00:00.000Z',
    });
  });

  it('HU02: lembra o último nome usado', () => {
    expect(carregarJogador()).toBe('');
    salvarJogador('Theo');
    expect(carregarJogador()).toBe('Theo');
  });

  it('tema: escuro por padrão e lembra a escolha', () => {
    expect(carregarTema()).toBe('escuro');
    salvarTema('claro');
    expect(carregarTema()).toBe('claro');
  });
});
