/**
 * COMPONENTE · Resultado no fim da partida (UC09 / HU09 e UC14 / HU14).
 *
 * Vitória: "Tabela completa!" com acertos e tempo usado.
 * Derrota: "Fim de jogo" com o motivo (tempo esgotado ou desistência);
 *          os elementos que faltaram ficam em vermelho na tabela, logo abaixo.
 * Também mostra "Novo recorde!" e as conquistas desbloqueadas na partida.
 *
 * Botões: Jogar novamente (mesmas configurações), Ranking e Menu.
 */
import { TOTAL_ELEMENTOS } from '../dados/elementos.js';
import { buscarConquista } from '../dados/conquistas.js';
import { buscarDificuldade } from '../dados/dificuldades.js';
import { formatarTempo } from '../logica/placar.js';
import { tempoUsado } from '../logica/partida.js';
import Botao from './Botao.jsx';
import { IconePlay, IconeRanking, IconeCasa } from './Icones.jsx';
import './ResultadoPartida.css';

const MOTIVOS = {
  tempo: 'O tempo acabou.',
  desistencia: 'Você desistiu da partida.',
};

export default function ResultadoPartida({ partida, novoRecorde, aoJogarNovamente, aoRanking, aoMenu }) {
  const venceu = partida.status === 'vitoria';
  const acertos = partida.encontrados.length;
  const faltaram = TOTAL_ELEMENTOS - acertos;

  return (
    <section className={`resultado ${venceu ? 'vitoria' : 'derrota'}`} aria-live="polite">
      <h1>{venceu ? 'Tabela completa!' : 'Fim de jogo'}</h1>

      {novoRecorde && <p className="recorde">Novo recorde!</p>}

      <p className="sub">
        {venceu
          ? `Você lembrou dos 118 elementos em ${formatarTempo(tempoUsado(partida))}.`
          : `${MOTIVOS[partida.motivoFim]} Faltaram ${faltaram} elementos. Eles estão marcados em vermelho na tabela.`}
      </p>

      <div className="numeros">
        <div className="stat"><small>Acertos</small><b>{acertos}<span className="total">/{TOTAL_ELEMENTOS}</span></b></div>
        <div className="stat"><small>Tempo usado</small><b>{formatarTempo(tempoUsado(partida))}</b></div>
        <div className="stat"><small>Dificuldade</small><b className="dificuldade">{buscarDificuldade(partida.dificuldade).nome}</b></div>
      </div>

      {partida.conquistasNovas.length > 0 && (
        <div className="conquistas-novas">
          <small>Conquistas desbloqueadas</small>
          <ul>
            {partida.conquistasNovas.map((id) => <li key={id}>🏆 {buscarConquista(id).nome}</li>)}
          </ul>
        </div>
      )}

      <div className="acoes">
        <Botao variante="primario" icone={IconePlay} onClick={aoJogarNovamente}>Jogar novamente</Botao>
        <Botao icone={IconeRanking} onClick={aoRanking}>Ranking</Botao>
        <Botao variante="fantasma" icone={IconeCasa} onClick={aoMenu}>Menu</Botao>
      </div>
    </section>
  );
}
