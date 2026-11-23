/**
 * TELA · Nova partida (UC02 Iniciar partida, que inclui UC03 Selecionar dificuldade).
 *
 * Pede o nome do jogador (lembra o último usado) e a dificuldade (Normal já vem marcada).
 * Toda partida passa por aqui, então toda partida tem dificuldade.
 *
 * Props: aoComecar({ jogador, dificuldade }), aoFechar
 */
import { useState } from 'react';
import Modal from '../componentes/Modal.jsx';
import Botao from '../componentes/Botao.jsx';
import { IconePlay } from '../componentes/Icones.jsx';
import { DIFICULDADES, DIFICULDADE_PADRAO } from '../dados/dificuldades.js';
import { formatarTempo } from '../logica/placar.js';
import { carregarJogador } from '../armazenamento/armazenamento.js';
import './NovaPartida.css';

export default function NovaPartida({ aoComecar, aoFechar }) {
  const [jogador, setJogador] = useState(carregarJogador);
  const [dificuldade, setDificuldade] = useState(DIFICULDADE_PADRAO);
  const nomeValido = jogador.trim().length > 0;

  function comecar(evento) {
    evento.preventDefault();
    if (nomeValido) aoComecar({ jogador: jogador.trim(), dificuldade });
  }

  return (
    <Modal titulo="Nova partida" aoFechar={aoFechar}>
      <form className="nova-partida" onSubmit={comecar}>
        <label htmlFor="nome-jogador">Seu nome</label>
        <input
          id="nome-jogador"
          value={jogador}
          onChange={(e) => setJogador(e.target.value)}
          maxLength={16}
          placeholder="Como você quer aparecer no ranking?"
          autoComplete="off"
          autoFocus
        />

        <span className="rotulo" id="rotulo-dificuldade">Dificuldade</span>
        <div className="dificuldades" role="radiogroup" aria-labelledby="rotulo-dificuldade">
          {DIFICULDADES.map((d) => (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={dificuldade === d.id}
              className={`opcao ${dificuldade === d.id ? 'sel' : ''}`}
              onClick={() => setDificuldade(d.id)}
            >
              <b>{d.nome}</b>
              <small>{formatarTempo(d.segundos)}</small>
            </button>
          ))}
        </div>

        <div className="modal-acoes">
          <Botao variante="fantasma" onClick={aoFechar}>Cancelar</Botao>
          <Botao type="submit" variante="primario" icone={IconePlay} disabled={!nomeValido}>Começar</Botao>
        </div>
      </form>
    </Modal>
  );
}
