/**
 * COMPONENTE · Cabeçalho: logo (fora do menu), nome do jogador e botão de tema.
 *
 * Props:
 *   mostrarLogo  false no menu (lá o logo grande já aparece)
 *   jogador      nome do jogador atual (opcional)
 *   tema         'escuro' | 'claro'
 *   aoAlternarTema
 */
import Logo from './Logo.jsx';
import { IconeUsuario, IconeSol, IconeLua } from './Icones.jsx';
import './Topo.css';

export default function Topo({ mostrarLogo, jogador, tema, aoAlternarTema }) {
  const irParaClaro = tema === 'escuro';

  return (
    <header className="topo">
      {mostrarLogo && <Logo />}
      <div className="conta">
        {jogador && (
          <span className="jogador" title="Jogador atual">
            <span className="avatar"><IconeUsuario /></span>
            <span className="nome">{jogador}</span>
          </span>
        )}
        <button
          type="button"
          className="tema"
          onClick={aoAlternarTema}
          aria-label={irParaClaro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
          title={irParaClaro ? 'Tema claro' : 'Tema escuro'}
        >
          {irParaClaro ? <IconeSol /> : <IconeLua />}
        </button>
      </div>
    </header>
  );
}
