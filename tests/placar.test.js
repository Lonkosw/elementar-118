// UC06 · Atualizar placar (HU06).
import { describe, it, expect } from 'vitest';
import { formatarTempo, tempoCritico, nivelDosAcertos, subiuDeNivel } from '../src/logica/placar.js';

describe('UC06 · placar (HU06)', () => {
  it('HU06: formata o tempo restante como MM:SS', () => {
    expect(formatarTempo(720)).toBe('12:00');
    expect(formatarTempo(65)).toBe('01:05');
    expect(formatarTempo(0)).toBe('00:00');
    expect(formatarTempo(-3)).toBe('00:00');
  });

  it('HU06: com menos de 1 minuto o cronômetro fica crítico', () => {
    expect(tempoCritico(61)).toBe(false);
    expect(tempoCritico(60)).toBe(false);
    expect(tempoCritico(59)).toBe(true);
    expect(tempoCritico(1)).toBe(true);
    expect(tempoCritico(0)).toBe(false);
  });

  it('HU06: a cada 10 acertos sobe de nível', () => {
    expect(subiuDeNivel(9)).toBe(false);
    expect(subiuDeNivel(10)).toBe(true);
    expect(subiuDeNivel(11)).toBe(false);
    expect(subiuDeNivel(20)).toBe(true);
    expect(subiuDeNivel(0)).toBe(false);
    expect(nivelDosAcertos(9)).toBe(0);
    expect(nivelDosAcertos(10)).toBe(1);
    expect(nivelDosAcertos(118)).toBe(11);
  });
});
