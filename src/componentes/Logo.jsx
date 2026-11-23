/**
 * COMPONENTE · Logotipo "ELEMENTAR 118" (o 118 vira um quadradinho de elemento).
 */
import './Logo.css';

export default function Logo({ grande = false }) {
  return (
    <div className={`logo ${grande ? 'grande' : ''}`}>
      ELEMENTAR<span className="sim">118</span>
    </div>
  );
}
