/**
 * TELA · Como jogar (UC01 / HU01).
 *
 * Janela com as instruções. Fecha pelo X, pelo botão "Entendi" ou pela tecla Esc.
 */
import Modal from '../componentes/Modal.jsx';
import Botao from '../componentes/Botao.jsx';
import './ComoJogar.css';

export default function ComoJogar({ aoFechar }) {
  return (
    <Modal titulo="Como jogar" aoFechar={aoFechar}>
      <div className="instrucoes">
        <p>
          A tabela periódica começa em branco. Digite o nome de um dos <b>118 elementos</b> e
          aperte <kbd>Enter</kbd>. Acentos, maiúsculas e espaços não importam.
        </p>
        <ul>
          <li><b>Acertou:</b> a casa acende com o símbolo e o nome.</li>
          <li><b>Já digitado:</b> a casa pisca e o jogo avisa que já está na tabela.</li>
          <li><b>Não existe:</b> o campo treme e o jogo avisa.</li>
        </ul>
        <p>
          Não há vidas nem pontos: o placar é o número de acertos. A cada 10 acertos você
          sobe de nível.
        </p>
        <p>
          A partida termina quando você <b>completa os 118</b> (vitória), quando o
          <b> tempo acaba</b> ou quando você <b>desiste</b> (derrota). Os melhores resultados vão para o Ranking.
        </p>
      </div>
      <div className="modal-acoes">
        <Botao variante="primario" onClick={aoFechar}>Entendi</Botao>
      </div>
    </Modal>
  );
}
