/**
 * TELA · Ranking (UC10 / HU10).
 *
 * Top 10 por dificuldade, com abas Fácil, Normal e Difícil.
 * Ordem: mais acertos; no empate, menor tempo. A última partida aparece destacada.
 */
import { useState } from 'react';
import { TOTAL_ELEMENTOS } from '../dados/elementos.js';
import { DIFICULDADES, DIFICULDADE_PADRAO } from '../dados/dificuldades.js';
import { formatarTempo } from '../logica/placar.js';
import { topPorDificuldade } from '../logica/ranking.js';
import { carregarResultados, carregarUltimaPartida } from '../armazenamento/armazenamento.js';
import Botao from '../componentes/Botao.jsx';
import { IconePlay, IconeCasa } from '../componentes/Icones.jsx';
import './Ranking.css';

/** "2026-11-18T10:00:00.000Z" → "18/11/2026" */
function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function Ranking({ aoJogar, aoMenu }) {
  const [resultados] = useState(carregarResultados);
  const [ultimaPartida] = useState(carregarUltimaPartida);

  // Abre direto na dificuldade da última partida jogada
  const dificuldadeInicial = resultados.find((r) => r.id === ultimaPartida)?.dificuldade ?? DIFICULDADE_PADRAO;
  const [dificuldade, setDificuldade] = useState(dificuldadeInicial);

  const linhas = topPorDificuldade(resultados, dificuldade);

  return (
    <section className="tela">
      <main className="pagina">
        <h1>Ranking</h1>

        <div className="segmento" role="tablist" aria-label="Dificuldade">
          {DIFICULDADES.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={dificuldade === d.id}
              className={dificuldade === d.id ? 'sel' : ''}
              onClick={() => setDificuldade(d.id)}
            >
              {d.nome}
            </button>
          ))}
        </div>

        {linhas.length === 0 ? (
          <p className="vazio">Ainda não há partidas nesta dificuldade. Que tal ser o primeiro?</p>
        ) : (
          <table className="ranking">
            <thead>
              <tr>
                <th>#</th>
                <th>Jogador</th>
                <th className="num">Acertos</th>
                <th className="num">Tempo</th>
                <th className="num data">Data</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((r, i) => (
                <tr key={r.id} className={r.id === ultimaPartida ? 'voce' : ''}>
                  <td>{i < 3 ? <span className={`pos p${i + 1}`}>{i + 1}</span> : i + 1}</td>
                  <td>{r.jogador}</td>
                  <td className="num"><b>{r.acertos}</b>/{TOTAL_ELEMENTOS}</td>
                  <td className="num">{formatarTempo(r.tempoUsado)}</td>
                  <td className="num data">{formatarData(r.data)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="nota">Ordenado por acertos. No empate, vence quem terminou mais rápido.</p>
        <div className="acoes">
          <Botao variante="primario" icone={IconePlay} onClick={aoJogar}>Jogar</Botao>
          <Botao variante="fantasma" icone={IconeCasa} onClick={aoMenu}>Menu</Botao>
        </div>
      </main>
    </section>
  );
}
