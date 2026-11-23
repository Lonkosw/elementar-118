/**
 * HOOK · Tema escuro/claro (extra). Lembra a escolha no localStorage.
 *
 * O tema é aplicado no <html> como data-tema="escuro" | "claro";
 * as cores de cada tema estão em estilos/global.css.
 */
import { useEffect, useState } from 'react';
import { carregarTema, salvarTema } from '../armazenamento/armazenamento.js';

export function useTema() {
  const [tema, setTema] = useState(carregarTema);

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    salvarTema(tema);
  }, [tema]);

  const alternar = () => setTema((atual) => (atual === 'escuro' ? 'claro' : 'escuro'));
  return [tema, alternar];
}
