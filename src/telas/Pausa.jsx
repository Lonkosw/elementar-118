/**
 * TELA · Pausa (UC07 / HU07, extensão de Jogar partida).
 *
 * O cronômetro está parado e a tabela escondida. Esc também continua o jogo.
 * Opções: Continuar, Reiniciar (nova partida com as mesmas configurações) e Voltar ao menu.
 */
import Modal from '../componentes/Modal.jsx';
import Botao from '../componentes/Botao.jsx';
import { IconePlay, IconeCasa } from '../componentes/Icones.jsx';
import './Pausa.css';

export default function Pausa({ aoContinuar, aoReiniciar, aoMenu }) {
  return (
    <Modal titulo="Pausado" aoFechar={aoContinuar} mostrarX={false}>
      <p className="pausa-texto">O tempo está parado e a tabela escondida.</p>
      <div className="pausa-botoes">
        <Botao variante="primario" icone={IconePlay} onClick={aoContinuar}>Continuar</Botao>
        <Botao onClick={aoReiniciar}>Reiniciar</Botao>
        <Botao variante="fantasma" icone={IconeCasa} onClick={aoMenu}>Voltar ao menu</Botao>
      </div>
    </Modal>
  );
}
