import { JogoTabuleiro, Expansao } from './jogo-tabuleiro.model';

export type JogoForm = Omit<JogoTabuleiro, 'id' | 'expansoes'> & {
  expansoes: Partial<Expansao>[];
};
