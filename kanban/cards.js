// Fonte dos cartões do quadro. Para atualizar o progresso da equipe: edite "col" e faça commit.
// Colunas: backlog | todo | doing | review | done
// tipo: obrigatorio | extra | doc
window.KANBAN_VERSAO = 2; // aumente ao mudar este arquivo para sobrepor o que estiver salvo no navegador
window.KANBAN_CARDS = [
  // ---- 3º bimestre (entregue em 01/10/2026) ----
  { id: "D01", titulo: "Diagrama de casos de uso (include/extend)", tipo: "doc", col: "done", prazo: "2026-10-01", ref: "docs/casos-de-uso.md" },
  { id: "D02", titulo: "Protótipos de tela (menu, gameplay, ranking) desktop e mobile", tipo: "doc", col: "done", prazo: "2026-10-01", ref: "prototipos/neon" },
  { id: "D03", titulo: "Histórias de usuário HU01–HU15", tipo: "doc", col: "done", prazo: "2026-10-01", ref: "docs/historias-de-usuario.md" },
  { id: "D04", titulo: "Repositório no GitHub + README com atendimento à especificação", tipo: "doc", col: "done", prazo: "2026-10-01" },
  { id: "D05", titulo: "Protótipo navegável (HTML) e lista dos 118 elementos", tipo: "doc", col: "done", ref: "prototipo-neon/index.html" },
  { id: "D06", titulo: "Quadro Kanban publicado (Vercel/Cloudflare)", tipo: "doc", col: "review" },

  // ---- 4º bimestre: código (entrega em 03/12/2026) ----
  { id: "HU02", titulo: "Iniciar partida (nome do jogador, tabela em branco, cronômetro)", tipo: "obrigatorio", col: "done", prazo: "2026-12-03" },
  { id: "HU04", titulo: "Jogar partida: digitar elementos e preencher a tabela", tipo: "obrigatorio", col: "done", prazo: "2026-12-03" },
  { id: "HU05", titulo: "Validar resposta (sem acento, sinônimos, repetido, inexistente)", tipo: "obrigatorio", col: "done", prazo: "2026-12-03" },
  { id: "HU06", titulo: "Placar: tempo, acertos x/118, nível a cada 10, aviso de 1 min", tipo: "obrigatorio", col: "done", prazo: "2026-12-03" },
  { id: "HU01", titulo: "Tela de instruções (Como jogar)", tipo: "obrigatorio", col: "done", prazo: "2026-12-03" },
  { id: "HU07", titulo: "Pausar partida (Continuar, Reiniciar, Menu)", tipo: "obrigatorio", col: "done", prazo: "2026-12-03" },
  { id: "HU08", titulo: "Desistir com confirmação", tipo: "obrigatorio", col: "done", prazo: "2026-12-03" },
  { id: "HU09", titulo: "Encerrar partida: vitória, derrota e faltantes destacados", tipo: "obrigatorio", col: "done", prazo: "2026-12-03" },
  { id: "HU13", titulo: "Salvar resultado no localStorage", tipo: "obrigatorio", col: "doing", prazo: "2026-12-03" },
  { id: "HU10", titulo: "Ranking top 10 por dificuldade", tipo: "obrigatorio", col: "done", prazo: "2026-12-03" },
  { id: "HU14", titulo: "Jogar novamente / voltar ao menu sem recarregar", tipo: "obrigatorio", col: "doing", prazo: "2026-12-03" },
  { id: "HU15", titulo: "Responsividade a partir de 360 px", tipo: "obrigatorio", col: "doing", prazo: "2026-12-03" },
  { id: "HU03", titulo: "Selecionar dificuldade (15:00 / 12:00 / 10:00)", tipo: "extra", col: "done", prazo: "2026-12-03" },
  { id: "HU11", titulo: "Tela de conquistas", tipo: "extra", col: "backlog" },
  { id: "HU12", titulo: "Desbloquear conquistas durante a partida", tipo: "extra", col: "backlog" },
  { id: "X01", titulo: "Efeitos sonoros com opção de mudo", tipo: "extra", col: "backlog" },

  // ---- 4º bimestre: entrega ----
  { id: "E01", titulo: "Atualizar diagrama de casos de uso", tipo: "doc", col: "todo", prazo: "2026-12-03" },
  { id: "E02", titulo: "Atualizar protótipos para ficarem iguais às telas finais", tipo: "doc", col: "todo", prazo: "2026-12-03" },
  { id: "E03", titulo: "Revisão final e envio do link do GitHub", tipo: "doc", col: "todo", prazo: "2026-12-03" },
  { id: "E04", titulo: "Apresentação final", tipo: "doc", col: "todo", prazo: "2026-12-04" }
];
