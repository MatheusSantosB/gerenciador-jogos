import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JogoTabuleiro } from '../models/jogo-tabuleiro.model';

@Injectable({
  providedIn: 'root'
})
export class JogosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/jogos';

  // Listar todos os jogos
  listar(): Observable<JogoTabuleiro[]> {
    return this.http.get<JogoTabuleiro[]>(this.apiUrl);
  }

  // Buscar por ID
  buscarPorId(id: number): Observable<JogoTabuleiro> {
    return this.http.get<JogoTabuleiro>(`${this.apiUrl}/${id}`);
  }

  // Criar novo jogo
  criar(jogo: any): Observable<JogoTabuleiro> {
    return this.http.post<JogoTabuleiro>(this.apiUrl, jogo);
  }

  // Atualizar jogo
  atualizar(id: number, jogo: any): Observable<JogoTabuleiro> {
    return this.http.put<JogoTabuleiro>(`${this.apiUrl}/${id}`, jogo);
  }

  // Deletar jogo
  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos de busca adicionais (opcionais, mas mantendo a compatibilidade)
  buscarPorCategoria(categoria: string): Observable<JogoTabuleiro[]> {
    return this.http.get<JogoTabuleiro[]>(`${this.apiUrl}?categoria=${categoria}`);
  }

  buscarPorNome(nome: string): Observable<JogoTabuleiro[]> {
    return this.http.get<JogoTabuleiro[]>(`${this.apiUrl}?nome_like=${nome}`);
  }
}