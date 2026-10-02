# Histórias de usuário

Formato: *Como jogador, quero … para …*, com critérios de aceitação. Cada história vem de um
caso de uso ([casos-de-uso.md](casos-de-uso.md)). Versão em texto: [historias-de-usuario.txt](historias-de-usuario.txt).

Regras: sem vidas e sem pontos; o placar é o número de acertos (x/118). A dificuldade muda só o tempo
(Fácil 15:00, Normal 12:00, Difícil 10:00). Ranking por acertos; no empate, menor tempo.

### HU01 · Consultar instruções (UC01) · Obrigatório
Como jogador, quero ler como o jogo funciona para saber o que fazer antes de começar.
- [ ] O menu mostra o nome do jogo, uma frase de apresentação e o botão "Como jogar".
- [ ] As instruções explicam as respostas possíveis (acertou, já digitado, não existe) e quando a partida acaba.
- [ ] As instruções fecham pelo X, por "Entendi" ou pela tecla Esc.

### HU02 · Iniciar partida (UC02) · Obrigatório
Como jogador, quero iniciar uma partida pelo menu para começar a jogar rapidamente.
- [ ] "Iniciar jogo" pede o nome do jogador (lembra o último nome usado).
- [ ] Ao começar, a tabela aparece em branco, o cronômetro começa a correr e o cursor já fica no campo de resposta.
- [ ] Sempre passa pela escolha de dificuldade (inclui o Caso 3).

### HU03 · Selecionar dificuldade (UC03) · Extra
Como jogador, quero escolher a dificuldade para o desafio combinar com o que eu sei.
- [ ] Fácil: 15:00. Normal (já vem selecionado): 12:00. Difícil: 10:00.
- [ ] A dificuldade escolhida aparece no topo durante a partida.

### HU04 · Jogar partida (UC04) · Obrigatório
Como jogador, quero digitar nomes de elementos e ver a tabela se completar para acompanhar meu progresso.
- [ ] Enter ou o botão envia a resposta e limpa o campo.
- [ ] A partida continua até completar 118/118 ou o tempo zerar.
- [ ] Toda resposta passa pela validação (inclui o Caso 5).

### HU05 · Validar resposta (UC05) · Obrigatório
Como jogador, quero que o jogo entenda o que eu digitei mesmo sem acento para não ser punido por digitação.
- [ ] Acentos, maiúsculas e espaços são ignorados (helio = Hélio) e sinônimos são aceitos (ex.: Azoto, Volfrâmio).
- [ ] Acertou: a casa acende com símbolo e nome e aparece "+1 Acertou!".
- [ ] Já digitado: a casa pisca e aparece "já está na tabela".
- [ ] Não existe: o campo treme e aparece "Esse elemento não existe".

### HU06 · Atualizar placar (UC06) · Obrigatório
Como jogador, quero ver tempo e acertos o tempo todo para saber como estou indo.
- [ ] O topo mostra tempo restante, acertos (x/118) e dificuldade.
- [ ] Cada acerto soma +1 no contador.
- [ ] A cada 10 acertos aparece a mensagem "Subiu de nível!".
- [ ] Com menos de 1 minuto, o cronômetro muda de cor e aparece um aviso.

### HU07 · Pausar partida (UC07) · Obrigatório (Recomendado)
Como jogador, quero pausar a partida para sair um momento sem perder tempo.
- [ ] O botão Pausar ou Esc para o cronômetro e esconde a tabela.
- [ ] A pausa tem Continuar, Reiniciar e Voltar ao menu.

### HU08 · Desistir da partida (UC08) · Obrigatório
Como jogador, quero desistir para ver as respostas quando não lembrar de mais nada.
- [ ] Desistir pede confirmação.
- [ ] Ao confirmar, a partida termina como derrota e o resultado vai para o ranking.

### HU09 · Encerrar partida (UC09) · Obrigatório
Como jogador, quero ver o resultado ao final para saber se venci e o que faltou.
- [ ] Vitória: com 118/118 aparece "Tabela completa!" com acertos e tempo usado.
- [ ] Derrota: quando o tempo zera ou o jogador desiste, aparece "Fim de jogo" com o motivo.
- [ ] Na derrota, os elementos que faltaram aparecem destacados na tabela.
- [ ] Se for o melhor resultado do jogador, aparece "Novo recorde!".
- [ ] Todo resultado é salvo (inclui o Caso 13).

### HU10 · Consultar ranking (UC10) · Obrigatório
Como jogador, quero ver os melhores resultados para comparar com os meus e os de amigos.
- [ ] O menu tem o botão "Ranking".
- [ ] O ranking mostra o top 10 com abas Fácil, Normal e Difícil.
- [ ] Colunas: posição, jogador, acertos (x/118), tempo e data.
- [ ] Ordem: mais acertos; empate, menor tempo. A última partida aparece destacada.

### HU11 · Consultar conquistas (UC11) · Extra
Como jogador, quero ver minhas conquistas para saber o que já desbloqueei e o que falta.
- [ ] A tela lista todas as conquistas; as bloqueadas aparecem com cadeado.
- [ ] Cada conquista mostra o nome e como desbloquear.

### HU12 · Desbloquear conquista (UC12) · Extra
Como jogador, quero desbloquear conquistas durante a partida para ter objetivos além do ranking.
- [ ] Exemplos: Gases nobres (coluna 18 completa), Metais alcalinos (coluna 1), Relâmpago (10 acertos em 30 s), Mendeleiev (tabela completa).
- [ ] O desbloqueio aparece na hora e no resultado final.
- [ ] A conquista fica salva no localStorage.

### HU13 · Salvar resultado (UC13) · Obrigatório
Como jogador, quero que meus resultados fiquem salvos para aparecerem no ranking depois.
- [ ] Toda partida encerrada grava nome, acertos, tempo usado, dificuldade e data no localStorage.
- [ ] Os dados continuam lá depois de fechar e abrir o navegador.

### HU14 · Jogar novamente (UC14) · Obrigatório
Como jogador, quero jogar de novo ou voltar ao menu sem recarregar a página.
- [ ] O resultado final tem os botões "Jogar novamente" (mesmas configurações) e "Menu".
- [ ] O jogo é zerado sem recarregar a página.

### HU15 · Jogar no celular (requisito não funcional) · Obrigatório
Como jogador, quero jogar pelo celular para jogar em qualquer lugar.
- [ ] Funciona no desktop e se adapta ao celular a partir de 360 px de largura.
- [ ] No celular, só a tabela rola para o lado; o restante da tela não.
