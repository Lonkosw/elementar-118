/**
 * HOOK · Liga a lógica da partida (logica/partida.js) à tela.
 *
 * Ele faz três coisas:
 *  1. guarda o estado da partida e expõe as ações (responder, pausar, desistir...);
 *  2. roda o cronômetro enquanto a partida está em andamento;
 *  3. salva no localStorage as conquistas (UC12) e o resultado final (UC13).
 *
 * Quem usa: telas/Jogo.jsx
 */
import { useEffect, useReducer, useRef, useState } from 'react';
import {
  criarPartida, responder, passarSegundo, pausar, continuar, desistir,
  partidaEncerrada, montarResultado,
} from '../logica/partida.js';
import { ehNovoRecorde } from '../logica/ranking.js';
import {
  carregarConquistas, salvarConquistas, carregarResultados, salvarResultado,
} from '../armazenamento/armazenamento.js';
import { useCronometro } from './useCronometro.js';

// ===== 1. REDUCER: traduz cada ação da tela numa função da lógica =====
function reduzir(partida, acao) {
  switch (acao.tipo) {
    case 'responder': return responder(partida, acao.texto);
    case 'segundo': return passarSegundo(partida);
    case 'pausar': return pausar(partida);
    case 'continuar': return continuar(partida);
    case 'desistir': return desistir(partida);
    default: return partida;
  }
}

// ===== 2. O HOOK =====
export function usePartida({ jogador, dificuldade }) {
  const [partida, enviar] = useReducer(reduzir, null, () =>
    criarPartida({
      jogador,
      dificuldade,
      conquistasJaDesbloqueadas: Object.keys(carregarConquistas()),
    }),
  );
  const [novoRecorde, setNovoRecorde] = useState(false);
  const resultadoSalvoDe = useRef(null); // evita salvar duas vezes a mesma partida

  // Cronômetro: 1 tique por segundo, só enquanto a partida está em andamento
  useCronometro(partida.status === 'andamento', () => enviar({ tipo: 'segundo' }));

  // UC12 · guarda as conquistas assim que são desbloqueadas
  useEffect(() => {
    if (partida.conquistasNovas.length > 0) salvarConquistas(partida.conquistasNovas);
  }, [partida.conquistasNovas]);

  // UC13 · ao encerrar, confere o recorde e salva o resultado no ranking
  useEffect(() => {
    if (!partidaEncerrada(partida) || resultadoSalvoDe.current === partida.id) return;
    resultadoSalvoDe.current = partida.id;
    const resultado = montarResultado(partida);
    setNovoRecorde(ehNovoRecorde(carregarResultados(), resultado)); // antes de salvar!
    salvarResultado(resultado);
  }, [partida]);

  return {
    partida,
    novoRecorde,
    responder: (texto) => enviar({ tipo: 'responder', texto }),
    pausar: () => enviar({ tipo: 'pausar' }),
    continuar: () => enviar({ tipo: 'continuar' }),
    desistir: () => enviar({ tipo: 'desistir' }),
  };
}
