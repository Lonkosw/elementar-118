/**
 * COMPONENTE · Botão padrão do jogo.
 *
 * Props:
 *   variante  'primario' (verde) | 'padrao' | 'fantasma' (sem fundo)
 *   icone     um componente de Icones.jsx (opcional)
 *   ...resto  vale para qualquer botão (onClick, type, disabled...)
 */
import './Botao.css';

export default function Botao({ variante = 'padrao', icone: Icone, children, className = '', ...resto }) {
  return (
    <button type="button" className={`botao ${variante} ${className}`} {...resto}>
      {Icone && <Icone />}
      <span>{children}</span>
    </button>
  );
}
