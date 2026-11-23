/**
 * COMPONENTE · Campo onde o jogador digita o nome do elemento (UC04 / HU04).
 *
 * Enter (ou o botão) envia a resposta e limpa o campo. O cursor fica sempre no campo.
 * Quando a resposta não existe, o campo treme (prop "tremer").
 *
 * Props: aoEnviar(texto), tremer (número que muda a cada erro), desativado
 */
import { useEffect, useRef, useState } from 'react';
import Botao from './Botao.jsx';
import { IconeEnter } from './Icones.jsx';
import './CampoResposta.css';

export default function CampoResposta({ aoEnviar, tremer, desativado = false }) {
  const [texto, setTexto] = useState('');
  const [tremendo, setTremendo] = useState(false);
  const campo = useRef(null);

  // O cursor já fica no campo ao começar e ao voltar da pausa
  useEffect(() => {
    if (!desativado) campo.current?.focus();
  }, [desativado]);

  // Treme sempre que "tremer" muda (a cada resposta inexistente)
  useEffect(() => {
    if (tremer) setTremendo(true);
  }, [tremer]);

  function enviar(evento) {
    evento.preventDefault();
    aoEnviar(texto);
    setTexto('');
    campo.current?.focus();
  }

  return (
    <form className="entrada" onSubmit={enviar}>
      <input
        ref={campo}
        className={`campo ${tremendo ? 'treme' : ''}`}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onAnimationEnd={() => setTremendo(false)}
        placeholder="Digite o nome de um elemento"
        aria-label="Nome do elemento"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        disabled={desativado}
      />
      <Botao type="submit" variante="primario" icone={IconeEnter} disabled={desativado}>Enter</Botao>
    </form>
  );
}
