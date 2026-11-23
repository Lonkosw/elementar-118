/**
 * COMPONENTE · Ícones em SVG (mesmos traços do protótipo neon).
 * Todos herdam a cor do texto (currentColor).
 */

const base = { viewBox: '0 0 24 24', 'aria-hidden': true, width: 16, height: 16 };
const traco = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const IconePlay = () => (
  <svg {...base} fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
);
export const IconeRanking = () => (
  <svg {...base} {...traco}><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8" /></svg>
);
export const IconeAjuda = () => (
  <svg {...base} {...traco} strokeWidth={2.4}><path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 1-1 1.7V14M12 18h.01" /></svg>
);
export const IconeEnter = () => (
  <svg {...base} {...traco} strokeWidth={2.4}><path d="M20 5v7H5M9 8l-4 4 4 4" /></svg>
);
export const IconeMedalha = () => (
  <svg {...base} {...traco}><circle cx="12" cy="9" r="5" /><path d="M8.5 13.5 7 21l5-3 5 3-1.5-7.5" /></svg>
);
export const IconeCadeado = () => (
  <svg {...base} {...traco}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const IconePausa = () => (
  <svg {...base} fill="currentColor"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
);
export const IconeBandeira = () => (
  <svg {...base} {...traco}><path d="M5 21V4M5 4h11l-2 4 2 4H5" /></svg>
);
export const IconeCasa = () => (
  <svg {...base} {...traco}><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" /></svg>
);
export const IconeSol = () => (
  <svg {...base} {...traco}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></svg>
);
export const IconeLua = () => (
  <svg {...base} {...traco}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
);
export const IconeUsuario = () => (
  <svg {...base} {...traco} width={20} height={20}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
);
