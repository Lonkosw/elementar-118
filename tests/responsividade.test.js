// @vitest-environment node
//
// HU15 · Jogar no celular (requisito não funcional).
// O jsdom não calcula layout, então aqui conferimos as regras de CSS que garantem
// o comportamento. A conferência visual (360 px) foi feita no navegador.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ler = (caminho) => readFileSync(join(process.cwd(), caminho), 'utf8');

function listar(pasta) {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) return listar(caminho);
    return extname(caminho) === '.css' ? [caminho] : [];
  });
}

describe('HU15 · responsividade', () => {
  it('HU15: a página declara viewport e o CSS se adapta a telas pequenas', () => {
    expect(ler('index.html')).toContain('width=device-width');
    const css = listar('src').map((a) => readFileSync(a, 'utf8')).join('\n');
    expect(css).toContain('@media (max-width: 720px)');
  });

  it('HU15: no celular só a tabela rola para o lado (a página não rola)', () => {
    const tabela = ler('src/componentes/TabelaPeriodica.css');
    expect(tabela).toMatch(/\.rolagem\s*{[^}]*overflow:\s*auto/);                    // a tabela tem a própria rolagem
    expect(tabela).toMatch(/@media \(max-width: 720px\)[\s\S]*width: max-content/);  // e é mais larga que a tela
    expect(ler('src/estilos/global.css')).toMatch(/body\s*{[^}]*overflow:\s*hidden/); // a página em si não rola de lado
  });
});
