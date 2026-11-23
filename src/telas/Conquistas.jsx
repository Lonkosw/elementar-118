/**
 * TELA · Conquistas (UC11 / HU11, extra).
 *
 * Lista todas as conquistas. As bloqueadas aparecem com cadeado.
 * Cada uma mostra o nome e como desbloquear.
 */
import { useState } from 'react';
import { CONQUISTAS } from '../dados/conquistas.js';
import { carregarConquistas } from '../armazenamento/armazenamento.js';
import Botao from '../componentes/Botao.jsx';
import { IconeMedalha, IconeCadeado, IconeCasa } from '../componentes/Icones.jsx';
import './Conquistas.css';

export default function Conquistas({ aoMenu }) {
  const [desbloqueadas] = useState(carregarConquistas);
  const total = CONQUISTAS.length;
  const quantas = CONQUISTAS.filter((c) => desbloqueadas[c.id]).length;

  return (
    <section className="tela">
      <main className="pagina larga">
        <h1>Conquistas</h1>
        <p className="progresso">{quantas} de {total} desbloqueadas</p>

        <ul className="conquistas">
          {CONQUISTAS.map((c) => {
            const liberada = Boolean(desbloqueadas[c.id]);
            return (
              <li key={c.id} className={`conquista ${liberada ? '' : 'bloqueada'}`} data-estado={liberada ? 'liberada' : 'bloqueada'}>
                <span className="medalha">{liberada ? <IconeMedalha /> : <IconeCadeado />}</span>
                <div>
                  <b>{c.nome}</b>
                  <small>{c.descricao}</small>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="acoes">
          <Botao variante="fantasma" icone={IconeCasa} onClick={aoMenu}>Menu</Botao>
        </div>
      </main>
    </section>
  );
}
