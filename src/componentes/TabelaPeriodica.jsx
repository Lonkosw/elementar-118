/**
 * COMPONENTE · A tabela periódica em grade de 18 colunas (UC04 / HU04).
 *
 * Começa em branco e cada casa "acende" com o símbolo e o nome quando o jogador acerta.
 * Estados de cada casa:
 *   vazia  ainda não acertou        certa  acertou        nova   acabou de acertar
 *   pisca  tentou digitar de novo   faltou elemento que não foi lembrado (derrota)
 *
 * Props:
 *   encontrados  números atômicos já acertados
 *   faltantes    números a destacar em vermelho (só quando a partida termina em derrota)
 *   resposta     última resposta (para a casa nova e para piscar a repetida)
 *   oculta       true na pausa (esconde a tabela)
 */
import { ELEMENTOS } from '../dados/elementos.js';
import './TabelaPeriodica.css';

/** Define as classes CSS da casa de acordo com o estado do elemento. */
function classesDaCasa(elemento, encontrados, faltantes, resposta) {
  const classes = ['casa'];
  const numeroDaResposta = resposta?.elemento?.numero;

  if (encontrados.has(elemento.numero)) {
    classes.push('certa');
    if (resposta?.tipo === 'acertou' && numeroDaResposta === elemento.numero) classes.push('nova');
  } else if (faltantes.has(elemento.numero)) {
    classes.push('faltou');
  }
  if (resposta?.tipo === 'repetido' && numeroDaResposta === elemento.numero) classes.push('pisca');
  return classes.join(' ');
}

export default function TabelaPeriodica({ encontrados, faltantes = [], resposta = null, oculta = false }) {
  const setEncontrados = new Set(encontrados);
  const setFaltantes = new Set(faltantes);

  return (
    <div className="rolagem">
      <div className={`tabela ${oculta ? 'oculta' : ''}`} role="grid" aria-label="Tabela periódica">
        {ELEMENTOS.map((e) => {
          const revelado = setEncontrados.has(e.numero) || setFaltantes.has(e.numero);
          const piscando = resposta?.tipo === 'repetido' && resposta.elemento.numero === e.numero;
          return (
            <div
              // a "key" muda a cada tentativa repetida para a animação de piscar recomeçar
              key={piscando ? `${e.numero}-${resposta.numeroDaResposta}` : e.numero}
              className={classesDaCasa(e, setEncontrados, setFaltantes, resposta)}
              style={{ gridRow: e.linha, gridColumn: e.coluna }}
              data-numero={e.numero}
              title={revelado ? e.nome : `Elemento ${e.numero}`}
            >
              <span className="n">{e.numero}</span>
              <span className="s">{e.simbolo}</span>
              <span className="nm">{e.nome}</span>
            </div>
          );
        })}
        {/* Marcadores das linhas separadas de lantanídeos e actinídeos */}
        <div className="casa faixa" style={{ gridRow: 6, gridColumn: 3 }}>57–71</div>
        <div className="casa faixa" style={{ gridRow: 7, gridColumn: 3 }}>89–103</div>
      </div>
    </div>
  );
}
