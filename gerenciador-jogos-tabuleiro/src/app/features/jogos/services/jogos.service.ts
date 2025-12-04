import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JogoTabuleiro } from '../models/jogo-tabuleiro.model';

@Injectable({
  providedIn: 'root'
})
export class JogosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/jogos';

  // Listar todos os jogos
  listar(): Observable<JogoTabuleiro[]> {
    return this.http.get<JogoTabuleiro[]>(this.apiUrl);
  }

  // Buscar por ID
  buscarPorId(id: number): Observable<JogoTabuleiro> {
    return this.http.get<JogoTabuleiro>(`${this.apiUrl}/${id}`);
  }

  // Criar novo jogo
  criar(jogo: Omit<JogoTabuleiro, 'id'>): Observable<JogoTabuleiro> {
    return this.http.post<JogoTabuleiro>(this.apiUrl, jogo);
  }

  // Atualizar jogo
  atualizar(id: number, jogo: Partial<JogoTabuleiro>): Observable<JogoTabuleiro> {
    return this.http.put<JogoTabuleiro>(`${this.apiUrl}/${id}`, jogo);
  }

  // Deletar jogo
  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Buscar por categoria
  buscarPorCategoria(categoria: string): Observable<JogoTabuleiro[]> {
    return this.http.get<JogoTabuleiro[]>(`${this.apiUrl}?categoria=${categoria}`);
  }

  // Buscar por nome
  buscarPorNome(nome: string): Observable<JogoTabuleiro[]> {
    return this.http.get<JogoTabuleiro[]>(`${this.apiUrl}?nome_like=${nome}`);
  }

  // Buscar por mecânica
  buscarPorMecanica(mecanica: string): Observable<JogoTabuleiro[]> {
    return this.http.get<JogoTabuleiro[]>(`${this.apiUrl}?mecanicas_like=${mecanica}`);
  }
}