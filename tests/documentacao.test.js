// @vitest-environment node
//
// Confere se o CÓDIGO e os TESTES estão de acordo com os DOCUMENTOS do projeto:
//   - docs/historias-de-usuario.md   (15 histórias e regras)
//   - docs/casos-de-uso.puml / .md   (diagrama com <<include>> e <<extend>>)
//   - prototipo-neon/index.html      (protótipo de tela oficial)
// Se alguém mudar um documento e esquecer o código (ou o contrário), este arquivo falha.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { ELEMENTOS } from '../src/dados/elementos.js';
import { DIFICULDADES } from '../src/dados/dificuldades.js';

// ===== Leitura dos arquivos =====
const ler = (caminho) => readFileSync(join(process.cwd(), caminho), 'utf8');

function listar(pasta, extensoes) {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) return listar(caminho, extensoes);
    return extensoes.includes(extname(caminho)) ? [caminho] : [];
  });
}

const historias = ler('docs/historias-de-usuario.md');
const puml = ler('docs/casos-de-uso.puml');
const casosDeUsoMd = ler('docs/casos-de-uso.md');
const prototipo = ler('prototipo-neon/index.html');

// Tudo o que está escrito nos testes (títulos) e no código-fonte do jogo
const arquivosDeTeste = listar('tests', ['.js', '.jsx']).filter((a) => !a.endsWith('documentacao.test.js'));
const textoDosTestes = arquivosDeTeste.map((a) => readFileSync(a, 'utf8')).join('\n');
const textoDoCodigo = listar('src', ['.js', '.jsx']).map((a) => readFileSync(a, 'utf8')).join('\n');

// ===== 1. HISTÓRIAS DE USUÁRIO =====
describe('Documentação · histórias de usuário', () => {
  const ids = [...historias.matchAll(/^### (HU\d\d)/gm)].map((m) => m[1]);

  it('o documento lista as 15 histórias', () => {
    expect(ids).toEqual(Array.from({ length: 15 }, (_, i) => `HU${String(i + 1).padStart(2, '0')}`));
  });

  for (const id of ['HU01', 'HU02', 'HU03', 'HU04', 'HU05', 'HU06', 'HU07', 'HU08', 'HU09', 'HU10', 'HU11', 'HU12', 'HU13', 'HU14', 'HU15']) {
    it(`${id} tem pelo menos um teste automático`, () => {
      expect(textoDosTestes).toMatch(new RegExp(`it\\(['"\`]${id}:`));
    });
  }

  it('a dificuldade do documento (15:00, 12:00, 10:00) é a do código', () => {
    const linha = historias.match(/Fácil (\d+):00, Normal (\d+):00, Difícil (\d+):00/);
    expect(linha).not.toBeNull();
    const [, facil, normal, dificil] = linha.map(Number);
    const doCodigo = Object.fromEntries(DIFICULDADES.map((d) => [d.id, d.segundos / 60]));
    expect(doCodigo).toEqual({ facil, normal, dificil });
  });

  it('as mensagens citadas nas histórias existem no código', () => {
    const mensagens = [
      'Acertou!', 'já está na tabela', 'Esse elemento não existe', 'Subiu de nível!',
      'Tabela completa!', 'Fim de jogo', 'Novo recorde!', 'Jogar novamente', 'Iniciar jogo',
      'Como jogar', 'Entendi', 'Continuar', 'Reiniciar', 'Voltar ao menu', 'Desistir',
    ];
    for (const mensagem of mensagens) {
      expect(historias, `"${mensagem}" deveria estar nas histórias`).toContain(mensagem);
      expect(textoDoCodigo, `"${mensagem}" deveria estar no código`).toContain(mensagem);
    }
  });

  it('as 4 conquistas de exemplo da HU12 existem no código', () => {
    for (const nome of ['Gases nobres', 'Metais alcalinos', 'Relâmpago', 'Mendeleiev']) {
      expect(historias).toContain(nome);
      expect(textoDoCodigo).toContain(nome);
    }
  });
});

// ===== 2. DIAGRAMA DE CASOS DE USO =====
describe('Documentação · diagrama de casos de uso', () => {
  const casos = [...puml.matchAll(/usecase "(UC\d\d) ([^"]+)"/g)].map((m) => ({ id: m[1], nome: m[2] }));
  const relacoes = [...puml.matchAll(/(UC\d\d) \.\.> (UC\d\d) : <<(include|extend)>>/g)]
    .map((m) => ({ origem: m[1], destino: m[2], tipo: m[3] }));

  it('o diagrama tem os 14 casos de uso e 9 relações (5 include e 4 extend)', () => {
    expect(casos).toHaveLength(14);
    expect(relacoes).toHaveLength(9);
    expect(relacoes.filter((r) => r.tipo === 'include')).toHaveLength(5);
    expect(relacoes.filter((r) => r.tipo === 'extend')).toHaveLength(4);
  });

  for (const { id, nome } of casos) {
    it(`${id} (${nome}) é citado nos testes`, () => {
      expect(textoDosTestes).toContain(id);
    });
  }

  for (const { origem, destino, tipo } of relacoes) {
    it(`${origem} <<${tipo}>> ${destino} tem um teste que a verifica`, () => {
      expect(textoDosTestes).toContain(`${origem} <<${tipo}>> ${destino}`);
    });
  }

  it('o diagrama (.puml) e a explicação (casos-de-uso.md) têm as mesmas relações', () => {
    const nasTabelas = [...casosDeUsoMd.matchAll(/\| (UC\d\d) [^|]+\| (UC\d\d) [^|]+\|/g)].map((m) => `${m[1]}>${m[2]}`);
    const noDiagrama = relacoes.map((r) => `${r.origem}>${r.destino}`);
    // nas tabelas include aparece como "base | incluído" e extend como "extensão | base": mesma ordem do .puml? não.
    // Por isso comparamos sem se importar com a direção.
    const semDirecao = (lista) => lista.map((p) => p.split('>').sort().join('-')).sort();
    expect(semDirecao(nasTabelas)).toEqual(semDirecao(noDiagrama));
  });
});

// ===== 3. PROTÓTIPO DE TELA =====
describe('Documentação · compatibilidade com o protótipo neon', () => {
  it('os 118 elementos do protótipo são os mesmos do código (número, símbolo, nome e categoria)', () => {
    const bloco = prototipo.match(/const ELEMENTOS = (\[[\s\S]*?\n\]);/)[1];
    const doPrototipo = new Function(`return ${bloco}`)();
    const doCodigo = ELEMENTOS.map((e) => [e.numero, e.simbolo, e.nome, e.categoria]);
    expect(doCodigo).toEqual(doPrototipo);
  });

  it('a posição de cada elemento na tabela é a mesma do protótipo', () => {
    const corpo = prototipo.match(/function posicao\(z\)\{([\s\S]*?)\n\}/)[1];
    const posicaoDoPrototipo = new Function('z', corpo);
    for (const e of ELEMENTOS) {
      expect([e.linha, e.coluna], `elemento ${e.numero}`).toEqual(posicaoDoPrototipo(e.numero));
    }
  });

  it('os textos das 3 telas do protótipo existem no jogo', () => {
    const textos = [
      'ELEMENTAR', '118 elementos', 'Iniciar jogo', 'Ranking', 'Como jogar',     // menu
      'Tempo', 'Acertos', 'Dificuldade', 'Digite o nome de um elemento', 'Enter', // gameplay
      'Jogador', 'Data', 'Fácil', 'Normal', 'Difícil',                            // ranking
      'Ordenado por acertos. No empate, vence quem terminou mais rápido.',
      'Theo Simão Lonkoski e Heloyse Angelina Ferreira, UTFPR Campo Mourão',
    ];
    for (const texto of textos) {
      expect(prototipo, `"${texto}" deveria estar no protótipo`).toContain(texto);
      expect(textoDoCodigo, `"${texto}" deveria estar no código`).toContain(texto);
    }
  });

  it('o jogo usa as cores e a fonte do protótipo', () => {
    const css = listar('src', ['.css']).map((a) => readFileSync(a, 'utf8')).join('\n');
    for (const cor of ['#3faa62', '#86f0a4', '#050505', '#121212']) {
      expect(prototipo).toContain(cor);
      expect(css.toLowerCase()).toContain(cor);
    }
    expect(prototipo).toContain('Mitr');
    expect(ler('index.html')).toContain('Mitr');
  });
});
