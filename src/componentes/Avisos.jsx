/**
 * COMPONENTE · Mensagens de feedback depois de cada resposta (HU05 e HU06).
 *
 *   Acertou      "+1 Acertou! Ouro (Au)"
 *   Já digitado  "Ouro já está na tabela"
 *   Não existe   "Esse elemento não existe"
 *   Subiu nível  "Subiu de nível! Nível 2"        (a cada 10 acertos)
 *   Conquista    "Conquista desbloqueada: Nome"   (extra)
 *
 * Cada mensagem some sozinha depois de alguns segundos.
 */
import { buscarConquista } from '../dados/conquistas.js';
import { useTemporario } from '../hooks/useTemporario.js';
import './Avisos.css';

/** Transforma a resposta da partida numa lista de avisos para mostrar. */
function montarAvisos(resposta) {
  if (!resposta) return [];
  const { tipo, elemento, subiuNivel, nivel, conquistas } = resposta;
  const avisos = [];

  if (tipo === 'acertou') {
    avisos.push({ classe: 'acerto', tag: '+1', texto: `Acertou! ${elemento.nome} (${elemento.simbolo})` });
  } else if (tipo === 'repetido') {
    avisos.push({ classe: 'repetido', tag: '!', texto: `${elemento.nome} já está na tabela` });
  } else if (tipo === 'inexistente') {
    avisos.push({ classe: 'erro', tag: '×', texto: 'Esse elemento não existe' });
  }
  if (subiuNivel) {
    avisos.push({ classe: 'nivel', tag: '★', texto: `Subiu de nível! Nível ${nivel}` });
  }
  for (const id of conquistas) {
    avisos.push({ classe: 'conquista', tag: '🏆', texto: `Conquista desbloqueada: ${buscarConquista(id).nome}` });
  }
  return avisos;
}

export default function Avisos({ resposta }) {
  const visivel = useTemporario(resposta);
  const avisos = montarAvisos(visivel);

  return (
    <div className="avisos" role="status" aria-live="polite">
      {avisos.map((aviso) => (
        <div key={aviso.texto} className={`toast ${aviso.classe}`}>
          <span className="tag">{aviso.tag}</span>
          {aviso.texto}
        </div>
      ))}
    </div>
  );
}
