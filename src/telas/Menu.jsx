/**
 * TELA · Menu inicial (UC01 Consultar instruções, UC02, UC10, UC11).
 *
 * Nome do jogo, frase de apresentação e os botões
 * Iniciar jogo, Ranking, Conquistas e Como jogar.
 */
import { useState } from 'react';
import Logo from '../componentes/Logo.jsx';
import Botao from '../componentes/Botao.jsx';
import { IconePlay, IconeRanking, IconeMedalha, IconeAjuda } from '../componentes/Icones.jsx';
import ComoJogar from './ComoJogar.jsx';
import './Menu.css';

export default function Menu({ aoIniciar, aoRanking, aoConquistas }) {
  const [mostrandoInstrucoes, setMostrandoInstrucoes] = useState(false);

  return (
    <section className="tela">
      <main className="menu">
        <Logo grande />
        <p className="slogan">
          Quantos dos <b>118 elementos</b> você lembra<br />antes do tempo acabar?
        </p>
        <div className="botoes">
          <Botao variante="primario" icone={IconePlay} onClick={aoIniciar}>Iniciar jogo</Botao>
          <Botao icone={IconeRanking} onClick={aoRanking}>Ranking</Botao>
          <Botao icone={IconeMedalha} onClick={aoConquistas}>Conquistas</Botao>
          <Botao variante="fantasma" icone={IconeAjuda} onClick={() => setMostrandoInstrucoes(true)}>Como jogar</Botao>
        </div>
      </main>
      <footer className="creditos">Theo Simão Lonkoski e Heloyse Angelina Ferreira, UTFPR Campo Mourão</footer>

      {mostrandoInstrucoes && <ComoJogar aoFechar={() => setMostrandoInstrucoes(false)} />}
    </section>
  );
}
