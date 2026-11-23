/**
 * COMPONENTE · Fundo da página: textura preta, foto do menu e névoa verde do jogo.
 * Só decoração: o CSS mostra cada camada conforme a tela atual (data-tela no <html>).
 */
import './Fundo.css';

export default function Fundo() {
  return (
    <>
      <div className="fundo" />
      <div className="foto" />
      <div className="nevoa" aria-hidden="true">
        <div className="deriva">
          <i className="a" />
          <i className="b" />
          <i className="c" />
          <svg viewBox="0 0 1200 700" preserveAspectRatio="none">
            <defs>
              <filter id="fumaca" x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency=".0016 .0042" numOctaves="3" seed="11" />
                <feColorMatrix values="0 0 0 0 .62  0 0 0 0 .80  0 0 0 0 .30  0 0 0 3 -1.45" />
                <feGaussianBlur stdDeviation="16" />
              </filter>
            </defs>
            <rect width="1200" height="700" filter="url(#fumaca)" />
          </svg>
        </div>
      </div>
    </>
  );
}
