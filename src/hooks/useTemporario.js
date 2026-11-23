/**
 * HOOK · Mostra um valor por alguns segundos e depois o esconde.
 * Usado nas mensagens de feedback ("Acertou!", "Subiu de nível!"...).
 *
 * Quando "valor" muda, a mensagem aparece de novo; passado o tempo, devolve null.
 */
import { useEffect, useState } from 'react';

export function useTemporario(valor, milissegundos = 3000) {
  const [expirado, setExpirado] = useState(null);

  useEffect(() => {
    if (!valor) return undefined;
    const espera = setTimeout(() => setExpirado(valor), milissegundos);
    return () => clearTimeout(espera);
  }, [valor, milissegundos]);

  return valor && valor !== expirado ? valor : null;
}
