/**
 * TELA · Partida (UC04 Jogar partida, com UC05, UC06, UC07, UC08 e UC09).
 *
 * Durante o jogo: placar, campo de resposta, mensagens e a tabela.
 * No fim: o resultado aparece no lugar do campo e a tabela mostra o que faltou.
 *
 * Props:
 *   config                 { jogador, dificuldade } da partida
 *   aoJogarNovamente       recomeça com as mesmas configurações (UC14)
 *   aoRanking, aoMenu      navegação
 */
import { useEffect, useState } from 'react';
import { ELEMENTOS } from '../dados/elementos.js';
import { usePartida } from '../hooks/usePartida.js';
import { partidaEncerrada, elementosFaltantes } from '../logica/partida.js';
import Placar from '../componentes/Placar.jsx';
import CampoResposta from '../componentes/CampoResposta.jsx';
import Avisos from '../componentes/Avisos.jsx';
import TabelaPeriodica from '../componentes/TabelaPeriodica.jsx';
import ResultadoPartida from '../componentes/ResultadoPartida.jsx';
import Botao from '../componentes/Botao.jsx';
import Modal from '../componentes/Modal.jsx';
import { IconePausa, IconeBandeira } from '../componentes/Icones.jsx';
import Pausa from './Pausa.jsx';
import './Jogo.css';

export default function Jogo({ config, aoJogarNovamente, aoRanking, aoMenu }) {
  const jogo = usePartida(config);
  const { partida } = jogo;
  const [confirmandoDesistencia, setConfirmandoDesistencia] = useState(false);

  const andamento = partida.status === 'andamento';
  const pausado = partida.status === 'pausado';
  const encerrada = partidaEncerrada(partida);
  const derrota = partida.status === 'derrota';

  // Esc pausa a partida (e, na pausa, a própria janela de pausa trata o Esc para continuar)
  useEffect(() => {
    if (!andamento || confirmandoDesistencia) return undefined;
    const aoApertarTecla = (evento) => {
      if (evento.key === 'Escape') jogo.pausar();
    };
    document.addEventListener('keydown', aoApertarTecla);
    return () => document.removeEventListener('keydown', aoApertarTecla);
  });

  function confirmarDesistencia() {
    setConfirmandoDesistencia(false);
    jogo.desistir();
  }

  const resposta = partida.resposta;
  const tremer = resposta?.tipo === 'inexistente' ? resposta.numeroDaResposta : 0;
  const faltantes = derrota ? elementosFaltantes(partida, ELEMENTOS).map((e) => e.numero) : [];

  return (
    <section className="tela">
      <main className="jogo">
        {encerrada ? (
          <ResultadoPartida
            partida={partida}
            novoRecorde={jogo.novoRecorde}
            aoJogarNovamente={aoJogarNovamente}
            aoRanking={aoRanking}
            aoMenu={aoMenu}
          />
        ) : (
          <>
            <Placar
              tempoRestante={partida.tempoRestante}
              acertos={partida.encontrados.length}
              dificuldade={partida.dificuldade}
            />
            <CampoResposta aoEnviar={jogo.responder} tremer={tremer} desativado={!andamento} />
            <Avisos resposta={resposta} />
            <div className="controles">
              <Botao icone={IconePausa} onClick={jogo.pausar} disabled={!andamento}>Pausar</Botao>
              <Botao variante="fantasma" icone={IconeBandeira} onClick={() => setConfirmandoDesistencia(true)} disabled={!andamento}>
                Desistir
              </Botao>
            </div>
          </>
        )}

        <TabelaPeriodica
          encontrados={partida.encontrados}
          faltantes={faltantes}
          resposta={encerrada ? null : resposta}
          oculta={pausado}
        />
        <p className="dica-mob">Arraste para ver a tabela inteira</p>
      </main>

      {pausado && (
        <Pausa aoContinuar={jogo.continuar} aoReiniciar={aoJogarNovamente} aoMenu={aoMenu} />
      )}

      {confirmandoDesistencia && (
        <Modal titulo="Desistir da partida?" aoFechar={() => setConfirmandoDesistencia(false)} mostrarX={false}>
          <p className="pausa-texto">
            A partida termina como derrota, os elementos que faltam serão revelados e seu resultado vai para o ranking.
          </p>
          <div className="modal-acoes">
            <Botao variante="fantasma" onClick={() => setConfirmandoDesistencia(false)}>Voltar ao jogo</Botao>
            <Botao variante="primario" onClick={confirmarDesistencia}>Desistir</Botao>
          </div>
        </Modal>
      )}
    </section>
  );
}
