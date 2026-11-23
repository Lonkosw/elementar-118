/**
 * HOOK · Cronômetro: chama uma função a cada segundo enquanto "ativo" for true.
 *
 * Usado por hooks/usePartida.js. Quando a partida pausa ou termina, "ativo" vira
 * false e o relógio para sozinho.
 */
import { useEffect, useRef } from 'react';

export function useCronometro(ativo, aoPassarSegundo) {
  // Guarda sempre a versão mais nova da função, sem reiniciar o relógio a cada render.
  const funcao = useRef(aoPassarSegundo);
  useEffect(() => {
    funcao.current = aoPassarSegundo;
  });

  useEffect(() => {
    if (!ativo) return undefined;
    const relogio = setInterval(() => funcao.current(), 1000);
    return () => clearInterval(relogio);
  }, [ativo]);
}
