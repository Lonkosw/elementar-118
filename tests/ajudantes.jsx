// Funções de apoio dos testes de tela: abrir o jogo, iniciar partida e responder.
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../src/App.jsx';
import { ELEMENTOS } from '../src/dados/elementos.js';

export function abrirJogo() {
  return render(<App />);
}

export const botao = (nome) => screen.getByRole('button', { name: nome });

/** Menu → "Iniciar jogo" → nome + dificuldade → "Começar". */
export function iniciarPartida({ nome = 'Ana', dificuldade } = {}) {
  fireEvent.click(botao('Iniciar jogo'));
  const campoNome = screen.getByLabelText('Seu nome');
  fireEvent.change(campoNome, { target: { value: nome } });
  if (dificuldade) fireEvent.click(screen.getByRole('radio', { name: new RegExp(dificuldade) }));
  fireEvent.click(botao('Começar'));
}

/** Digita uma resposta no campo e aperta Enter. */
export function responder(texto) {
  const campo = screen.getByLabelText('Nome do elemento');
  fireEvent.change(campo, { target: { value: texto } });
  fireEvent.submit(campo.closest('form'));
}

/** Responde vários elementos pelo número atômico. */
export function acertar(...numeros) {
  for (const n of numeros) responder(ELEMENTOS[n - 1].nome);
}

export const tempoNaTela = () => screen.getByLabelText('Tempo restante').textContent;
export const acertosNaTela = () => screen.getByLabelText('Acertos').textContent;
export const casa = (numero) => document.querySelector(`[data-numero="${numero}"]`);

export { screen, fireEvent, within };
