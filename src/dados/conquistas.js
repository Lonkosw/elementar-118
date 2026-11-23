/**
 * DADOS · Lista de conquistas (UC11 / UC12, extra).
 *
 * Aqui só ficam nome e descrição. A condição de cada uma está em
 * logica/conquistas.js, com o mesmo "id".
 */

export const CONQUISTAS = [
  { id: 'primeiro-contato', nome: 'Primeiro contato', descricao: 'Acerte seu primeiro elemento' },
  { id: 'gases-nobres', nome: 'Gases nobres', descricao: 'Complete toda a coluna 18' },
  { id: 'metais-alcalinos', nome: 'Metais alcalinos', descricao: 'Complete toda a coluna 1' },
  { id: 'relampago', nome: 'Relâmpago', descricao: 'Acerte 10 elementos em 30 segundos' },
  { id: 'sem-erros', nome: 'Sem errar', descricao: 'Termine uma partida (com 10 acertos ou mais) sem nenhum erro' },
  { id: 'terras-raras', nome: 'Terras raras', descricao: 'Complete todos os lantanídeos' },
  { id: 'meio-caminho', nome: 'Meio caminho', descricao: 'Acerte 59 elementos numa partida' },
  { id: 'mendeleiev', nome: 'Mendeleiev', descricao: 'Complete a tabela inteira' },
  { id: 'mestre', nome: 'Mestre', descricao: 'Complete a tabela no Difícil' },
];

export function buscarConquista(id) {
  return CONQUISTAS.find((c) => c.id === id);
}
