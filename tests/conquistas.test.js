// UC11 · Consultar conquistas e UC12 · Desbloquear conquista (HU11, HU12 - extras).
import { describe, it, expect } from 'vitest';
import { criarPartida, responder, passarSegundo, desistir } from '../src/logica/partida.js';
import { CONQUISTAS } from '../src/dados/conquistas.js';
import { ELEMENTOS } from '../src/dados/elementos.js';

const nova = (extra = {}) => criarPartida({ id: 1, jogador: 'Ana', ...extra });
const acertar = (p, numeros) => numeros.reduce((x, n) => responder(x, ELEMENTOS[n - 1].nome), p);
const numerosDe = (filtro) => ELEMENTOS.filter(filtro).map((e) => e.numero);

describe('UC11 · Consultar conquistas (HU11)', () => {
  it('HU11: cada conquista tem nome e como desbloquear', () => {
    expect(CONQUISTAS.length).toBeGreaterThanOrEqual(4);
    for (const c of CONQUISTAS) {
      expect(c.nome).toBeTruthy();
      expect(c.descricao).toBeTruthy();
    }
  });

  it('HU12: existem as conquistas dos exemplos da história (Gases nobres, Metais alcalinos, Relâmpago, Mendeleiev)', () => {
    const nomes = CONQUISTAS.map((c) => c.nome);
    for (const nome of ['Gases nobres', 'Metais alcalinos', 'Relâmpago', 'Mendeleiev']) {
      expect(nomes).toContain(nome);
    }
  });
});

describe('UC12 <<extend>> UC05 · Desbloquear conquista (HU12)', () => {
  it('HU12: o primeiro acerto desbloqueia "Primeiro contato" na hora', () => {
    const p = responder(nova(), 'Ouro');
    expect(p.conquistasNovas).toContain('primeiro-contato');
    expect(p.resposta.conquistas).toEqual(['primeiro-contato']);
  });

  it('HU12: Gases nobres (coluna 18 completa)', () => {
    const col18 = numerosDe((e) => e.coluna === 18);
    const quase = acertar(nova(), col18.slice(0, -1));
    expect(quase.conquistasNovas).not.toContain('gases-nobres');
    const completo = acertar(nova(), col18);
    expect(completo.conquistasNovas).toContain('gases-nobres');
  });

  it('HU12: Metais alcalinos (coluna 1 completa)', () => {
    const p = acertar(nova(), numerosDe((e) => e.coluna === 1));
    expect(p.conquistasNovas).toContain('metais-alcalinos');
  });

  it('HU12: Terras raras (15 lantanídeos)', () => {
    const p = acertar(nova(), numerosDe((e) => e.categoria === 'la'));
    expect(p.conquistasNovas).toContain('terras-raras');
  });

  it('HU12: Relâmpago (10 acertos em até 30 segundos)', () => {
    const rapido = acertar(nova(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // tudo no segundo 0
    expect(rapido.conquistasNovas).toContain('relampago');

    let devagar = nova();
    for (let n = 1; n <= 10; n++) {
      devagar = responder(devagar, ELEMENTOS[n - 1].nome);
      for (let s = 0; s < 4; s++) devagar = passarSegundo(devagar); // 4 s entre acertos = 36 s no total
    }
    expect(devagar.conquistasNovas).not.toContain('relampago');
  });

  it('HU12: Meio caminho (59 acertos)', () => {
    const p = acertar(nova(), Array.from({ length: 59 }, (_, i) => i + 1));
    expect(p.conquistasNovas).toContain('meio-caminho');
  });

  it('HU12: Mendeleiev e Mestre (tabela completa; Mestre só no Difícil)', () => {
    const todos = Array.from({ length: 118 }, (_, i) => i + 1);
    const normal = acertar(nova(), todos);
    expect(normal.conquistasNovas).toContain('mendeleiev');
    expect(normal.conquistasNovas).not.toContain('mestre');
    const dificil = acertar(nova({ dificuldade: 'dificil' }), todos);
    expect(dificil.conquistasNovas).toContain('mestre');
  });

  it('HU12: Sem errar só aparece ao terminar a partida, com 10+ acertos e zero erros', () => {
    const p = acertar(nova(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(p.conquistasNovas).not.toContain('sem-erros'); // ainda em andamento
    expect(desistir(p).conquistasNovas).toContain('sem-erros');

    const comErro = desistir(responder(p, 'Vibranium'));
    expect(comErro.conquistasNovas).not.toContain('sem-erros');
  });

  it('HU12: conquista já desbloqueada antes não aparece como nova', () => {
    const p = responder(nova({ conquistasJaDesbloqueadas: ['primeiro-contato'] }), 'Ouro');
    expect(p.conquistasNovas).not.toContain('primeiro-contato');
  });

  it('HU12: a mesma conquista não é desbloqueada duas vezes na partida', () => {
    let p = responder(nova(), 'Ouro');
    p = responder(p, 'Prata');
    expect(p.conquistasNovas.filter((id) => id === 'primeiro-contato')).toHaveLength(1);
  });
});
