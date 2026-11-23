// UC05 · Validar resposta (HU05).
import { describe, it, expect } from 'vitest';
import { normalizar, validarResposta } from '../src/logica/validarResposta.js';
import { ELEMENTOS } from '../src/dados/elementos.js';

describe('UC05 · normalizar (HU05)', () => {
  it('HU05: ignora acentos, maiúsculas e espaços', () => {
    expect(normalizar('  Hélio ')).toBe('helio');
    expect(normalizar('HÉLIO')).toBe('helio');
    expect(normalizar('h e l i o')).toBe('helio');
  });
});

describe('UC05 · validarResposta (HU05)', () => {
  it('HU05: "helio" sem acento acerta Hélio', () => {
    const r = validarResposta('helio', []);
    expect(r.tipo).toBe('acertou');
    expect(r.elemento.simbolo).toBe('He');
  });

  it('HU05: aceita sinônimos (Azoto, Volfrâmio)', () => {
    expect(validarResposta('Azoto', []).elemento.simbolo).toBe('N');
    expect(validarResposta('volframio', []).elemento.simbolo).toBe('W');
    expect(validarResposta('Wolfrâmio', []).elemento.simbolo).toBe('W');
  });

  it('HU05: resposta já digitada é "repetido"', () => {
    const r = validarResposta('Ouro', [79]);
    expect(r.tipo).toBe('repetido');
    expect(r.elemento.simbolo).toBe('Au');
  });

  it('HU05: um sinônimo de elemento já digitado também é "repetido"', () => {
    expect(validarResposta('azoto', [7]).tipo).toBe('repetido');
  });

  it('HU05: nome que não existe é "inexistente"', () => {
    expect(validarResposta('Vibranium', []).tipo).toBe('inexistente');
    expect(validarResposta('', []).tipo).toBe('inexistente');
  });

  it('HU05: todos os 118 nomes oficiais são reconhecidos, com e sem acento', () => {
    for (const e of ELEMENTOS) {
      expect(validarResposta(e.nome, []).elemento.numero).toBe(e.numero);
      expect(validarResposta(e.nome.toUpperCase(), []).elemento.numero).toBe(e.numero);
      expect(validarResposta(normalizar(e.nome), []).elemento.numero).toBe(e.numero);
    }
  });
});
