/**
 * ENTRADA · Liga o React à página (index.html) e carrega o CSS global.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './estilos/global.css';
import App from './App.jsx';

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
