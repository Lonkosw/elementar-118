// Regras da partida: UC02, UC04, UC05, UC06, UC07, UC08, UC09 e as relações do diagrama.
import { describe, it, expect } from 'vitest';
import {
  criarPartida, responder, passarSegundo, pausar, continuar, desistir,
  elementosFaltantes, montarResultado, tempoUsado,
} from '../src/logica/partida.js';
import { ELEMENTOS } from '../src/dados/elementos.js';

const nova = (extra = {}) => criarPartida({ id: 1, jogador: 'Ana', ...extra });

/** Responde todos os elementos pedidos (lista de números atômicos). */
function acertarTodos(partida, numeros) {
  return numeros.reduce((p, n) => responder(p, ELEMENTOS[n - 1].nome), partida);
}
const todosOsNumeros = Array.from({ length: 118 }, (_, i) => i + 1);

describe('UC02 · Iniciar partida (HU02)', () => {
  it('HU02: começa com a tabela em branco, cronômetro cheio e em andamento', () => {
    const p = nova();
    expect(p.encontrados).toEqual([]);
    expect(p.status).toBe('andamento');
    expect(p.tempoRestante).toBe(p.tempoTotal);
    expect(p.jogador).toBe('Ana');
  });

  it('UC02 <<include>> UC03: toda partida tem dificuldade (Normal por padrão)', () => {
    expect(nova().dificuldade).toBe('normal');
    expect(nova().tempoTotal).toBe(12 * 60);
  });

  it('HU03: o tempo muda com a dificuldade (15:00, 12:00, 10:00)', () => {
    expect(nova({ dificuldade: 'facil' }).tempoTotal).toBe(900);
    expect(nova({ dificuldade: 'normal' }).tempoTotal).toBe(720);
    expect(nova({ dificuldade: 'dificil' }).tempoTotal).toBe(600);
  });
});

describe('UC04 · Jogar partida (HU04)', () => {
  it('HU04: acertar soma 1 e guarda o elemento', () => {
    const p = responder(nova(), 'Ouro');
    expect(p.encontrados).toEqual([79]);
    expect(p.resposta.tipo).toBe('acertou');
  });

  it('HU04: campo vazio não faz nada', () => {
    const p = nova();
    expect(responder(p, '   ')).toBe(p);
  });

  it('HU04: não aceita resposta com a partida pausada ou encerrada', () => {
    const pausada = pausar(nova());
    expect(responder(pausada, 'Ouro')).toBe(pausada);
    const fim = desistir(nova());
    expect(responder(fim, 'Ouro')).toBe(fim);
  });

  it('HU04: a partida continua até 118/118 ou o tempo zerar', () => {
    const p = acertarTodos(nova(), [1, 2, 3]);
    expect(p.status).toBe('andamento');
  });
});

describe('UC04 <<include>> UC05 · toda resposta passa pela validação (HU05)', () => {
  it('HU05: acertou, repetido e inexistente geram o tipo certo', () => {
    let p = responder(nova(), 'helio');
    expect(p.resposta.tipo).toBe('acertou');
    p = responder(p, 'HÉLIO');
    expect(p.resposta.tipo).toBe('repetido');
    expect(p.encontrados).toEqual([2]);
    p = responder(p, 'xyz');
    expect(p.resposta.tipo).toBe('inexistente');
  });

  it('HU05: repetido não soma acerto; inexistente soma erro', () => {
    let p = responder(nova(), 'Ouro');
    p = responder(p, 'Ouro');
    expect(p.encontrados).toHaveLength(1);
    expect(p.erros).toBe(0);
    p = responder(p, 'Vibranium');
    expect(p.erros).toBe(1);
  });

  it('HU05: o número da resposta aumenta a cada envio (usado para animar a tela)', () => {
    let p = responder(nova(), 'Ouro');
    const primeiro = p.resposta.numeroDaResposta;
    p = responder(p, 'Ouro');
    expect(p.resposta.numeroDaResposta).toBe(primeiro + 1);
  });
});

describe('UC05 <<include>> UC06 · toda validação atualiza o placar (HU06)', () => {
  it('HU06: cada acerto soma +1 e registra o momento do acerto', () => {
    let p = nova();
    p = passarSegundo(passarSegundo(p));
    p = responder(p, 'Ouro');
    expect(p.encontrados).toHaveLength(1);
    expect(p.registroAcertos).toEqual([{ numero: 79, segundos: 2 }]);
  });

  it('HU06: a cada 10 acertos aparece "Subiu de nível"', () => {
    const p9 = acertarTodos(nova(), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(p9.resposta.subiuNivel).toBe(false);
    const p10 = responder(p9, ELEMENTOS[9].nome);
    expect(p10.resposta.subiuNivel).toBe(true);
    expect(p10.resposta.nivel).toBe(1);
  });
});

describe('UC07 <<extend>> UC04 · Pausar partida (HU07)', () => {
  it('HU07: pausar para o cronômetro; continuar volta ao jogo', () => {
    let p = pausar(nova());
    expect(p.status).toBe('pausado');
    const antes = p.tempoRestante;
    p = passarSegundo(p);
    expect(p.tempoRestante).toBe(antes); // relógio parado
    p = continuar(p);
    expect(p.status).toBe('andamento');
    expect(passarSegundo(p).tempoRestante).toBe(antes - 1);
  });
});

describe('UC08 <<extend>> UC04 · Desistir da partida (HU08)', () => {
  it('HU08: desistir termina como derrota com o motivo "desistencia"', () => {
    const p = desistir(responder(nova(), 'Ouro'));
    expect(p.status).toBe('derrota');
    expect(p.motivoFim).toBe('desistencia');
  });

  it('HU08: dá para desistir também com a partida pausada', () => {
    expect(desistir(pausar(nova())).status).toBe('derrota');
  });
});

describe('UC04 <<include>> UC09 · Encerrar partida (HU09)', () => {
  it('HU09: derrota quando o tempo zera', () => {
    let p = nova();
    for (let i = 0; i < p.tempoTotal; i++) p = passarSegundo(p);
    expect(p.status).toBe('derrota');
    expect(p.motivoFim).toBe('tempo');
    expect(p.tempoRestante).toBe(0);
  });

  it('HU09: vitória com 118/118', () => {
    const p = acertarTodos(nova(), todosOsNumeros);
    expect(p.status).toBe('vitoria');
    expect(p.motivoFim).toBe('completou');
    expect(p.encontrados).toHaveLength(118);
  });

  it('HU09: na derrota, os elementos que faltaram são listados', () => {
    const p = desistir(acertarTodos(nova(), [1, 2, 3]));
    const faltantes = elementosFaltantes(p, ELEMENTOS);
    expect(faltantes).toHaveLength(115);
    expect(faltantes.map((e) => e.numero)).not.toContain(2);
  });

  it('HU09: depois de encerrada, o tempo não anda mais', () => {
    const p = desistir(nova());
    expect(passarSegundo(p)).toBe(p);
  });
});

describe('UC09 <<include>> UC13 · resultado pronto para salvar (HU13)', () => {
  it('HU13: o resultado leva nome, acertos, tempo usado, dificuldade e data', () => {
    let p = nova({ dificuldade: 'dificil' });
    p = passarSegundo(passarSegundo(passarSegundo(p)));
    p = desistir(responder(p, 'Ouro'));
    const r = montarResultado(p, '2026-11-18T10:00:00.000Z');
    expect(r).toEqual({
      id: '1', jogador: 'Ana', acertos: 1, tempoUsado: 3,
      dificuldade: 'dificil', venceu: false, data: '2026-11-18T10:00:00.000Z',
    });
    expect(tempoUsado(p)).toBe(3);
  });
});
