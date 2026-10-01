// Exporta as telas principais como SVG editável para importar no Figma.
// Arraste o .svg para o Figma: retângulos, textos e ícones viram camadas.
// Uso: node exportar-svg.mjs
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(aqui, '..', 'prototipos', 'figma');
fs.mkdirSync(saida, { recursive: true });
const pagina = pathToFileURL(path.join(aqui, 'prototipo.html')).href;

const TELAS = [['01-menu', 'menu'], ['02-gameplay', 'jogo'], ['03-ranking', 'ranking']];
const DISPOSITIVOS = [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]];

// Roda dentro da página: percorre o DOM e desenha cada caixa e texto em SVG
function domParaSvg() {
  const W = innerWidth, H = innerHeight;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const visivel = c => c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c);
  const out = [];
  const raiz = document.querySelector('.frame');

  function caixa(el) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || r.right < 0 || r.bottom < 0 || r.left > W || r.top > H) return;
    const op = parseFloat(cs.opacity);
    const bw = parseFloat(cs.borderTopWidth);
    const rx = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, r.height / 2);
    const fill = visivel(cs.backgroundColor) ? cs.backgroundColor : 'none';
    const stroke = bw > 0 && visivel(cs.borderTopColor) ? cs.borderTopColor : null;
    if (fill !== 'none' || stroke) {
      const nome = (el.className && typeof el.className === 'string' ? el.className : el.tagName).trim().split(/\s+/)[0];
      const dash = cs.borderTopStyle === 'dashed' ? ' stroke-dasharray="6 4"' : '';
      const ins = stroke ? bw / 2 : 0;
      out.push(`<rect data-name="${esc(nome)}" x="${r.left + ins}" y="${r.top + ins}" width="${r.width - 2 * ins}" height="${r.height - 2 * ins}" rx="${rx}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${bw}"${dash}` : ''}${op < 1 ? ` opacity="${op}"` : ''}/>`);
      // borda inferior mais grossa (campo de resposta no estilo Termo)
      const bb = parseFloat(cs.borderBottomWidth);
      if (stroke && bb > bw) out.push(`<rect x="${r.left + rx / 2}" y="${r.bottom - bb}" width="${r.width - rx}" height="${bb}" fill="${stroke}"/>`);
    }
    if (el.tagName.toLowerCase() === 'svg') {
      const clone = el.cloneNode(true);
      clone.setAttribute('x', r.left); clone.setAttribute('y', r.top);
      clone.setAttribute('width', r.width); clone.setAttribute('height', r.height);
      out.push(clone.outerHTML.replace(/currentColor/g, cs.color));
      return;
    }
    for (const filho of el.childNodes) {
      if (filho.nodeType === 1) caixa(filho);
      else if (filho.nodeType === 3 && filho.textContent.trim()) texto(filho, cs);
    }
  }

  function texto(no, cs) {
    const pedacos = [];
    const range = document.createRange();
    range.selectNodeContents(no);
    const rects = range.getClientRects();
    if (rects.length <= 1) pedacos.push([no.textContent.replace(/\s+/g, ' '), range.getBoundingClientRect()]);
    else {
      // texto quebrado em várias linhas: posiciona palavra por palavra
      const t = no.textContent; let i = 0;
      for (const p of t.split(/(\s+)/)) {
        if (p.trim()) { range.setStart(no, i); range.setEnd(no, i + p.length); pedacos.push([p, range.getBoundingClientRect()]); }
        i += p.length;
      }
    }
    const fs = parseFloat(cs.fontSize);
    const tt = cs.textTransform;
    for (let [s, r] of pedacos) {
      if (r.width === 0 || r.left > W || r.top > H) continue;
      if (tt === 'uppercase') s = s.toUpperCase();
      const base = r.top + r.height / 2 + fs * 0.36;
      const ls = cs.letterSpacing === 'normal' ? '' : ` letter-spacing="${parseFloat(cs.letterSpacing)}"`;
      const op = parseFloat(getComputedStyle(no.parentElement).opacity);
      out.push(`<text xml:space="preserve" x="${r.left}" y="${base}" font-family="Mitr" font-size="${fs}" font-weight="${cs.fontWeight}" fill="${cs.color}"${ls}${op < 1 ? ` opacity="${op}"` : ''}>${esc(s)}</text>`);
    }
  }

  const bg = getComputedStyle(raiz).backgroundColor;
  caixa(raiz);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n<rect width="${W}" height="${H}" fill="${bg}"/>\n${out.join('\n')}\n</svg>\n`;
}

const browser = await chromium.launch();
for (const [disp, viewport] of DISPOSITIVOS) {
  const page = await browser.newPage({ viewport });
  for (const [arquivo, tela] of TELAS) {
    await page.goto(`${pagina}?tela=${tela}&disp=${disp}`);
    await page.evaluate(() => document.fonts.ready);
    const svg = await page.evaluate(domParaSvg);
    fs.writeFileSync(path.join(saida, `${disp}-${arquivo}.svg`), svg);
  }
  await page.close();
}
await browser.close();
console.log('SVGs gerados em', saida);
