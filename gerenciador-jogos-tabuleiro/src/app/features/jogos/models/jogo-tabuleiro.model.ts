export interface NumeroJogadores {
  min: number;
  max: number;
  ideal: number;
}

export interface TempoJogo {
  min: number;
  max: number;
}

export interface Expansao {
  id: number;
  nome: string;
  preco: number;
  lancamento: number;
  descricao: string;
}

export type Categoria = 
  | 'Estratégia' 
  | 'Familiar' 
  | 'Party' 
  | 'Cooperativo' 
  | 'Abstrato' 
  | 'Eurogame';

export type FaixaEtaria = '6+' | '8+' | '10+' | '12+' | '14+' | '18+';

export interface JogoTabuleiro {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: Categoria;
  faixaEtaria: FaixaEtaria;
  numeroJogadores: NumeroJogadores;
  tempoJogo: TempoJogo;
  complexidade: 1 | 2 | 3 | 4 | 5;
  designer: string;
  editora: string;
  anoPublicacao: number;
  mecanicas: string[];
  expansoes: Expansao[];
  imagemUrl: string;
  notaMedia: number;
  estoque: number;
  disponivel: boolean;
  tags: string[];
  bggLink?: string;
}