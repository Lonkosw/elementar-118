/**
 * APP · Escolhe qual tela mostrar e guarda o que as telas compartilham.
 *
 * Telas: menu → jogo → (resultado dentro do jogo) → ranking / conquistas.
 * Não usamos biblioteca de rotas: um simples estado "tela" resolve.
 *
 * "chavePartida" muda a cada nova partida; como a tela do jogo usa essa chave,
 * o React a recria do zero. É assim que "Jogar novamente" zera tudo sem recarregar a página (UC14).
 */
import { useEffect, useState } from 'react';
import { useTema } from './hooks/useTema.js';
import { salvarJogador } from './armazenamento/armazenamento.js';
import Fundo from './componentes/Fundo.jsx';
import Topo from './componentes/Topo.jsx';
import Menu from './telas/Menu.jsx';
import NovaPartida from './telas/NovaPartida.jsx';
import Jogo from './telas/Jogo.jsx';
import Ranking from './telas/Ranking.jsx';
import Conquistas from './telas/Conquistas.jsx';

export default function App() {
  const [tela, setTela] = useState('menu'); // 'menu' | 'jogo' | 'ranking' | 'conquistas'
  const [config, setConfig] = useState(null); // { jogador, dificuldade } da última partida
  const [chavePartida, setChavePartida] = useState(0);
  const [escolhendoPartida, setEscolhendoPartida] = useState(false);
  const [tema, alternarTema] = useTema();

  // O CSS usa data-tela para mudar o fundo (foto no menu, névoa no jogo)
  useEffect(() => {
    document.documentElement.dataset.tela = tela;
  }, [tela]);

  // ===== Ações de navegação =====
  const irParaMenu = () => setTela('menu');
  const irParaRanking = () => setTela('ranking');

  function comecarPartida(novaConfig) {
    salvarJogador(novaConfig.jogador);
    setConfig(novaConfig);
    setChavePartida((n) => n + 1);
    setEscolhendoPartida(false);
    setTela('jogo');
  }

  // UC14 · mesmas configurações, partida nova, sem recarregar a página
  const jogarNovamente = () => setChavePartida((n) => n + 1);

  return (
    <>
      <Fundo />
      <div className="app">
        <Topo
          mostrarLogo={tela !== 'menu'}
          jogador={tela !== 'menu' ? config?.jogador : null}
          tema={tema}
          aoAlternarTema={alternarTema}
        />

        {tela === 'menu' && (
          <Menu
            aoIniciar={() => setEscolhendoPartida(true)}
            aoRanking={irParaRanking}
            aoConquistas={() => setTela('conquistas')}
          />
        )}
        {tela === 'jogo' && (
          <Jogo
            key={chavePartida}
            config={config}
            aoJogarNovamente={jogarNovamente}
            aoRanking={irParaRanking}
            aoMenu={irParaMenu}
          />
        )}
        {tela === 'ranking' && (
          <Ranking aoJogar={() => setEscolhendoPartida(true)} aoMenu={irParaMenu} />
        )}
        {tela === 'conquistas' && <Conquistas aoMenu={irParaMenu} />}
      </div>

      {escolhendoPartida && (
        <NovaPartida aoComecar={comecarPartida} aoFechar={() => setEscolhendoPartida(false)} />
      )}
    </>
  );
}
