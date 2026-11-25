// Testes de tela: o jogador usando o jogo do começo ao fim, uma história de usuário por vez.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import {
  abrirJogo, botao, iniciarPartida, responder, acertar, tempoNaTela, acertosNaTela, casa,
  screen, fireEvent, within,
} from './ajudantes.jsx';
import { ELEMENTOS } from '../src/dados/elementos.js';

const esc = () => fireEvent.keyDown(document, { key: 'Escape' });
// O nome também aparece no cabeçalho; aqui interessa só a célula do ranking.
const celula = (nome) => screen.getByRole('cell', { name: nome });
const passarSegundos = (n) => act(() => { vi.advanceTimersByTime(n * 1000); });

afterEach(() => {
  vi.useRealTimers();
  delete document.documentElement.dataset.tema;
  delete document.documentElement.dataset.tela;
});

describe('UC01 · Consultar instruções (HU01)', () => {
  it('HU01: o menu mostra o nome do jogo, a frase e os botões', () => {
    abrirJogo();
    expect(screen.getByText(/ELEMENTAR/)).toBeInTheDocument();
    expect(screen.getByText(/118 elementos/)).toBeInTheDocument();
    for (const nome of ['Iniciar jogo', 'Ranking', 'Como jogar']) expect(botao(nome)).toBeInTheDocument();
  });

  it('HU01: as instruções explicam as respostas e quando a partida acaba', () => {
    abrirJogo();
    fireEvent.click(botao('Como jogar'));
    const janela = screen.getByRole('dialog', { name: 'Como jogar' });
    for (const texto of [/Acertou/, /Já digitado/, /Não existe/, /118/, /tempo acaba/, /desiste/]) {
      expect(within(janela).getAllByText(texto).length).toBeGreaterThan(0);
    }
  });

  it('HU01: as instruções fecham pelo X, por "Entendi" e pela tecla Esc', () => {
    abrirJogo();
    for (const fechar of [
      () => fireEvent.click(screen.getByRole('button', { name: 'Fechar' })),
      () => fireEvent.click(botao('Entendi')),
      () => esc(),
    ]) {
      fireEvent.click(botao('Como jogar'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      fechar();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }
  });
});

describe('UC02 · Iniciar partida (HU02)', () => {
  it('HU02: "Iniciar jogo" pede o nome do jogador', () => {
    abrirJogo();
    fireEvent.click(botao('Iniciar jogo'));
    expect(screen.getByRole('dialog', { name: 'Nova partida' })).toBeInTheDocument();
    expect(screen.getByLabelText('Seu nome')).toBeInTheDocument();
    expect(botao('Começar')).toBeDisabled(); // sem nome não começa
  });

  it('HU02: lembra o último nome usado', () => {
    abrirJogo();
    iniciarPartida({ nome: 'Theo' });
    fireEvent.click(botao('Pausar'));
    fireEvent.click(botao('Voltar ao menu'));
    fireEvent.click(botao('Iniciar jogo'));
    expect(screen.getByLabelText('Seu nome')).toHaveValue('Theo');
    expect(botao('Começar')).toBeEnabled();
  });

  it('HU02: ao começar, a tabela está em branco, o cronômetro corre e o cursor está no campo', () => {
    vi.useFakeTimers();
    abrirJogo();
    iniciarPartida();
    expect(acertosNaTela()).toBe('0/118');
    expect(screen.getByLabelText('Nome do elemento')).toHaveFocus();
    expect(document.querySelectorAll('.casa.certa')).toHaveLength(0);
    expect(tempoNaTela()).toBe('12:00');
    passarSegundos(3);
    expect(tempoNaTela()).toBe('11:57');
  });
});

describe('UC02 <<include>> UC03 · Selecionar dificuldade (HU03)', () => {
  it('HU03: Normal já vem selecionado e todas as opções mostram o tempo', () => {
    abrirJogo();
    fireEvent.click(botao('Iniciar jogo'));
    expect(screen.getByRole('radio', { name: /Normal/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /Fácil/ })).toHaveTextContent('15:00');
    expect(screen.getByRole('radio', { name: /Normal/ })).toHaveTextContent('12:00');
    expect(screen.getByRole('radio', { name: /Difícil/ })).toHaveTextContent('10:00');
  });

  it('HU03: a dificuldade escolhida define o tempo e aparece no topo da partida', () => {
    abrirJogo();
    iniciarPartida({ dificuldade: 'Difícil' });
    expect(tempoNaTela()).toBe('10:00');
    expect(screen.getByText('Difícil')).toBeInTheDocument();
  });

  it('HU03: Fácil começa com 15:00', () => {
    abrirJogo();
    iniciarPartida({ dificuldade: 'Fácil' });
    expect(tempoNaTela()).toBe('15:00');
  });
});

describe('UC04 · Jogar partida (HU04)', () => {
  it('HU04: Enter envia a resposta e limpa o campo', () => {
    abrirJogo();
    iniciarPartida();
    responder('Ouro');
    expect(screen.getByLabelText('Nome do elemento')).toHaveValue('');
    expect(acertosNaTela()).toBe('1/118');
  });

  it('HU04: a tabela tem 118 casas, em branco, que acendem ao acertar', () => {
    abrirJogo();
    iniciarPartida();
    expect(document.querySelectorAll('[data-numero]')).toHaveLength(118);
    responder('Ouro');
    expect(casa(79)).toHaveClass('certa');
    expect(casa(79)).toHaveTextContent('Au');
    expect(casa(79)).toHaveTextContent('Ouro');
    expect(casa(1)).not.toHaveClass('certa');
  });
});

describe('UC04 <<include>> UC05 · Validar resposta (HU05)', () => {
  it('HU05: sem acento e em minúsculas também acerta, e mostra "+1 Acertou!"', () => {
    abrirJogo();
    iniciarPartida();
    responder('helio');
    expect(screen.getByText(/Acertou! Hélio \(He\)/)).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
    expect(casa(2)).toHaveClass('certa');
  });

  it('HU05: aceita sinônimo (Azoto = Nitrogênio)', () => {
    abrirJogo();
    iniciarPartida();
    responder('Azoto');
    expect(casa(7)).toHaveClass('certa');
  });

  it('HU05: já digitado: a casa pisca e aparece "já está na tabela"', () => {
    abrirJogo();
    iniciarPartida();
    responder('Ouro');
    responder('Ouro');
    expect(screen.getByText(/já está na tabela/)).toBeInTheDocument();
    expect(casa(79)).toHaveClass('pisca');
    expect(acertosNaTela()).toBe('1/118');
  });

  it('HU05: não existe: o campo treme e aparece "Esse elemento não existe"', () => {
    abrirJogo();
    iniciarPartida();
    responder('Vibranium');
    expect(screen.getByText('Esse elemento não existe')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome do elemento')).toHaveClass('treme');
    expect(acertosNaTela()).toBe('0/118');
  });
});

describe('UC05 <<include>> UC06 · Atualizar placar (HU06)', () => {
  it('HU06: o topo mostra tempo, acertos (x/118) e dificuldade', () => {
    abrirJogo();
    iniciarPartida();
    expect(tempoNaTela()).toBe('12:00');
    expect(acertosNaTela()).toBe('0/118');
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('HU06: a cada 10 acertos aparece "Subiu de nível!"', () => {
    abrirJogo();
    iniciarPartida();
    acertar(1, 2, 3, 4, 5, 6, 7, 8, 9);
    expect(screen.queryByText(/Subiu de nível/)).not.toBeInTheDocument();
    acertar(10);
    expect(screen.getByText(/Subiu de nível!/)).toBeInTheDocument();
  });

  it('HU06: com menos de 1 minuto o cronômetro muda de cor e aparece um aviso', () => {
    vi.useFakeTimers();
    abrirJogo();
    iniciarPartida();
    passarSegundos(12 * 60 - 61);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    passarSegundos(2);
    expect(screen.getByRole('alert')).toHaveTextContent('menos de 1 minuto');
    expect(screen.getByLabelText('Tempo restante').closest('.stat')).toHaveClass('critico');
  });
});

describe('UC07 <<extend>> UC04 · Pausar partida (HU07)', () => {
  it('HU07: Pausar para o cronômetro, esconde a tabela e oferece Continuar, Reiniciar e Voltar ao menu', () => {
    vi.useFakeTimers();
    abrirJogo();
    iniciarPartida();
    passarSegundos(5);
    fireEvent.click(botao('Pausar'));

    expect(screen.getByRole('dialog', { name: 'Pausado' })).toBeInTheDocument();
    expect(document.querySelector('.tabela')).toHaveClass('oculta');
    for (const nome of ['Continuar', 'Reiniciar', 'Voltar ao menu']) expect(botao(nome)).toBeInTheDocument();

    passarSegundos(10);
    fireEvent.click(botao('Continuar'));
    expect(tempoNaTela()).toBe('11:55'); // o tempo da pausa não contou
    passarSegundos(1);
    expect(tempoNaTela()).toBe('11:54');
  });

  it('HU07: a tecla Esc pausa e, na pausa, continua', () => {
    abrirJogo();
    iniciarPartida();
    esc();
    expect(screen.getByRole('dialog', { name: 'Pausado' })).toBeInTheDocument();
    esc();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('HU07: Reiniciar começa uma partida nova com as mesmas configurações', () => {
    abrirJogo();
    iniciarPartida({ dificuldade: 'Difícil' });
    acertar(1, 2, 3);
    fireEvent.click(botao('Pausar'));
    fireEvent.click(botao('Reiniciar'));
    expect(acertosNaTela()).toBe('0/118');
    expect(tempoNaTela()).toBe('10:00');
  });

  it('HU07: Voltar ao menu abandona a partida', () => {
    abrirJogo();
    iniciarPartida();
    fireEvent.click(botao('Pausar'));
    fireEvent.click(botao('Voltar ao menu'));
    expect(botao('Iniciar jogo')).toBeInTheDocument();
  });
});

describe('UC08 <<extend>> UC04 · Desistir da partida (HU08)', () => {
  it('HU08: Desistir pede confirmação e dá pra voltar ao jogo', () => {
    abrirJogo();
    iniciarPartida();
    fireEvent.click(botao('Desistir'));
    expect(screen.getByRole('dialog', { name: /Desistir/ })).toBeInTheDocument();
    fireEvent.click(botao('Voltar ao jogo'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Fim de jogo')).not.toBeInTheDocument();
  });

  it('HU08: ao confirmar, termina como derrota e o resultado vai para o ranking', () => {
    abrirJogo();
    iniciarPartida({ nome: 'Ana' });
    acertar(1, 2, 3);
    fireEvent.click(botao('Desistir'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desistir' }));
    expect(screen.getByText('Fim de jogo')).toBeInTheDocument();
    expect(screen.getByText(/Você desistiu/)).toBeInTheDocument();

    fireEvent.click(botao('Ranking'));
    expect(celula('Ana')).toBeInTheDocument();
  });
});

describe('UC04 <<include>> UC09 · Encerrar partida (HU09)', () => {
  it('HU09: derrota por tempo mostra "Fim de jogo" com o motivo e destaca o que faltou', () => {
    vi.useFakeTimers();
    abrirJogo();
    iniciarPartida();
    acertar(1, 2, 3);
    passarSegundos(12 * 60);
    expect(screen.getByText('Fim de jogo')).toBeInTheDocument();
    expect(screen.getByText(/O tempo acabou/)).toBeInTheDocument();
    expect(screen.getByText(/Faltaram 115 elementos/)).toBeInTheDocument();
    // os elementos que faltaram ficam destacados e revelados na tabela
    expect(document.querySelectorAll('.casa.faltou')).toHaveLength(115);
    expect(casa(79)).toHaveClass('faltou');
    expect(casa(79)).toHaveTextContent('Ouro');
    expect(casa(1)).not.toHaveClass('faltou');
  });

  it('HU09: vitória com 118/118 mostra "Tabela completa!" com acertos e tempo usado', () => {
    vi.useFakeTimers();
    abrirJogo();
    iniciarPartida();
    passarSegundos(65);
    for (const e of ELEMENTOS) responder(e.nome);
    expect(screen.getByText('Tabela completa!')).toBeInTheDocument();
    expect(screen.getByText(/em 01:05/)).toBeInTheDocument();
    expect(screen.getByText('118', { selector: 'b' })).toBeInTheDocument();
    expect(screen.getByText('Novo recorde!')).toBeInTheDocument();
    expect(document.querySelectorAll('.casa.faltou')).toHaveLength(0);
  }, 30000); // digita os 118 elementos; em máquina lenta passa dos 5 s padrão

  it('HU09: "Novo recorde!" só aparece quando supera o melhor resultado do jogador', () => {
    abrirJogo();
    iniciarPartida({ nome: 'Ana' });
    acertar(1, 2, 3, 4, 5);
    fireEvent.click(botao('Desistir'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desistir' }));
    expect(screen.getByText('Novo recorde!')).toBeInTheDocument();

    fireEvent.click(botao('Jogar novamente'));
    acertar(1, 2);
    fireEvent.click(botao('Desistir'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desistir' }));
    expect(screen.queryByText('Novo recorde!')).not.toBeInTheDocument();
  });
});

describe('UC10 · Consultar ranking (HU10) e UC13 · Salvar resultado (HU13)', () => {
  function jogarEDesistir(nome, dificuldade, ...elementos) {
    iniciarPartida({ nome, dificuldade });
    acertar(...elementos);
    fireEvent.click(botao('Desistir'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desistir' }));
  }

  it('HU10: o menu tem o botão "Ranking" e ele mostra a tabela com as colunas pedidas', () => {
    abrirJogo();
    fireEvent.click(botao('Ranking'));
    // sem partidas ainda, aparece uma mensagem no lugar da tabela
    expect(screen.getByText(/Ainda não há partidas/)).toBeInTheDocument();

    fireEvent.click(botao('Menu'));
    jogarEDesistir('Ana', undefined, 1, 2, 3);
    fireEvent.click(botao('Ranking'));
    for (const coluna of ['#', 'Jogador', 'Acertos', 'Tempo', 'Data']) {
      expect(screen.getByRole('columnheader', { name: coluna })).toBeInTheDocument();
    }
    const linha = celula('Ana').closest('tr');
    expect(linha).toHaveTextContent('3/118');
  });

  it('HU10: abas Fácil, Normal e Difícil separam os resultados', () => {
    abrirJogo();
    iniciarPartida({ nome: 'Ana', dificuldade: 'Fácil' });
    acertar(1);
    fireEvent.click(botao('Desistir'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desistir' }));
    fireEvent.click(botao('Ranking'));

    expect(screen.getByRole('tab', { name: 'Fácil' })).toHaveAttribute('aria-selected', 'true');
    expect(celula('Ana')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Difícil' }));
    expect(screen.queryByRole('cell', { name: 'Ana' })).not.toBeInTheDocument();
  });

  it('HU10: mais acertos primeiro e a última partida aparece destacada', () => {
    abrirJogo();
    iniciarPartida({ nome: 'Bia', dificuldade: 'Normal' });
    acertar(1, 2, 3, 4, 5, 6);
    fireEvent.click(botao('Desistir'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desistir' }));
    fireEvent.click(botao('Jogar novamente'));
    acertar(1, 2);
    fireEvent.click(botao('Desistir'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desistir' }));
    fireEvent.click(botao('Ranking'));

    const linhas = screen.getAllByRole('row').slice(1); // sem o cabeçalho
    expect(linhas[0]).toHaveTextContent('6/118');
    expect(linhas[1]).toHaveTextContent('2/118');
    expect(linhas[1]).toHaveClass('voce'); // a última partida foi a de 2 acertos
    expect(linhas[0]).not.toHaveClass('voce');
  });

  it('HU13: todo resultado grava nome, acertos, tempo, dificuldade e data no localStorage', () => {
    abrirJogo();
    jogarEDesistir('Ana', 'Difícil', 1, 2, 3, 4);
    const salvos = JSON.parse(localStorage.getItem('elementar118:ranking'));
    expect(salvos).toHaveLength(1);
    expect(salvos[0]).toMatchObject({ jogador: 'Ana', acertos: 4, dificuldade: 'dificil' });
    expect(typeof salvos[0].tempoUsado).toBe('number');
    expect(salvos[0].data).toBeTruthy();
  });

  it('HU13: o resultado é salvo uma única vez por partida', () => {
    abrirJogo();
    jogarEDesistir('Ana', undefined, 1);
    expect(JSON.parse(localStorage.getItem('elementar118:ranking'))).toHaveLength(1);
  });
});

describe('UC14 <<extend>> UC09 · Jogar novamente (HU14)', () => {
  it('HU14: "Jogar novamente" zera o jogo com as mesmas configurações, sem recarregar', () => {
    abrirJogo();
    iniciarPartida({ nome: 'Ana', dificuldade: 'Difícil' });
    acertar(1, 2, 3);
    fireEvent.click(botao('Desistir'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desistir' }));

    fireEvent.click(botao('Jogar novamente'));
    expect(acertosNaTela()).toBe('0/118');
    expect(tempoNaTela()).toBe('10:00');
    expect(screen.getByText('Difícil')).toBeInTheDocument();
    expect(document.querySelectorAll('.casa.certa')).toHaveLength(0);
  });

  it('HU14: "Menu" no resultado volta ao menu', () => {
    abrirJogo();
    iniciarPartida();
    fireEvent.click(botao('Desistir'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desistir' }));
    fireEvent.click(botao('Menu'));
    expect(botao('Iniciar jogo')).toBeInTheDocument();
  });
});

describe('UC11 · Consultar conquistas e UC12 · Desbloquear conquista (HU11, HU12)', () => {
  it('HU11: lista todas as conquistas; as bloqueadas aparecem com cadeado e a descrição', () => {
    abrirJogo();
    fireEvent.click(botao('Conquistas'));
    expect(screen.getByText('0 de 9 desbloqueadas')).toBeInTheDocument();
    const itens = screen.getAllByRole('listitem');
    expect(itens).toHaveLength(9);
    for (const item of itens) expect(item).toHaveAttribute('data-estado', 'bloqueada');
    expect(screen.getByText('Complete toda a coluna 18')).toBeInTheDocument();
  });

  it('HU12: o desbloqueio aparece na hora, no resultado final e fica salvo', () => {
    abrirJogo();
    iniciarPartida();
    responder('Ouro');
    expect(screen.getByText(/Conquista desbloqueada: Primeiro contato/)).toBeInTheDocument();

    fireEvent.click(botao('Desistir'));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Desistir' }));
    expect(screen.getByText(/Conquistas desbloqueadas/)).toBeInTheDocument();
    expect(screen.getByText(/🏆 Primeiro contato/)).toBeInTheDocument();

    expect(JSON.parse(localStorage.getItem('elementar118:conquistas'))).toHaveProperty('primeiro-contato');
    fireEvent.click(botao('Menu'));
    fireEvent.click(botao('Conquistas'));
    expect(screen.getByText('1 de 9 desbloqueadas')).toBeInTheDocument();
  });
});

describe('Tema claro/escuro (extra)', () => {
  it('alterna o tema e lembra a escolha', () => {
    abrirJogo();
    expect(document.documentElement.dataset.tema).toBe('escuro');
    fireEvent.click(screen.getByRole('button', { name: /tema claro/i }));
    expect(document.documentElement.dataset.tema).toBe('claro');
    expect(JSON.parse(localStorage.getItem('elementar118:tema'))).toBe('claro');
  });
});
