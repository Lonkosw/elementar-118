/**
 * COMPONENTE · Janela sobre a tela (instruções, nova partida, pausa, confirmação).
 *
 * - Esc chama "aoFechar";
 * - clicar no fundo escuro também;
 * - ao abrir, o foco vai para a janela e, ao fechar, volta para onde estava.
 *
 * Props: titulo, aoFechar, mostrarX (padrão true), children
 */
import { useEffect, useId, useRef } from 'react';
import './Modal.css';

export default function Modal({ titulo, aoFechar, mostrarX = true, children }) {
  const idTitulo = useId();
  const janela = useRef(null);
  const fechar = useRef(aoFechar);

  useEffect(() => {
    fechar.current = aoFechar;
  });

  useEffect(() => {
    const anterior = document.activeElement;
    // Só puxa o foco se nenhum campo da janela já o tiver pedido (autoFocus)
    if (!janela.current.contains(document.activeElement)) janela.current.focus();

    const aoApertarTecla = (evento) => {
      if (evento.key === 'Escape') fechar.current();
    };
    document.addEventListener('keydown', aoApertarTecla);
    return () => {
      document.removeEventListener('keydown', aoApertarTecla);
      anterior?.focus?.();
    };
  }, []);

  return (
    <div className="modal-fundo" onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={idTitulo} tabIndex={-1} ref={janela}>
        <header className="modal-topo">
          <h2 id={idTitulo}>{titulo}</h2>
          {mostrarX && (
            <button type="button" className="modal-x" aria-label="Fechar" onClick={aoFechar}>×</button>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
