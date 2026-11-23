/**
 * COMPONENTE · Placar do topo durante a partida (UC06 / HU06).
 *
 * Mostra tempo restante, acertos (x/118) e dificuldade.
 * Com menos de 1 minuto, o cronômetro muda de cor e aparece um aviso.
 */
import { TOTAL_ELEMENTOS } from '../dados/elementos.js';
import { buscarDificuldade } from '../dados/dificuldades.js';
import { formatarTempo, tempoCritico } from '../logica/placar.js';
import './Placar.css';

export default function Placar({ tempoRestante, acertos, dificuldade }) {
  const critico = tempoCritico(tempoRestante);

  return (
    <div className="placar">
      <div className="hud">
        <div className={`stat tempo ${critico ? 'critico' : ''}`}>
          <small>Tempo</small>
          <b aria-label="Tempo restante">{formatarTempo(tempoRestante)}</b>
        </div>
        <div className="stat">
          <small>Acertos</small>
          <b aria-label="Acertos">
            {acertos}
            <span className="total">/{TOTAL_ELEMENTOS}</span>
          </b>
        </div>
        <div className="stat">
          <small>Dificuldade</small>
          <b className="dificuldade">{buscarDificuldade(dificuldade).nome}</b>
        </div>
      </div>
      {critico && <p className="aviso-tempo" role="alert">Falta menos de 1 minuto!</p>}
    </div>
  );
}
