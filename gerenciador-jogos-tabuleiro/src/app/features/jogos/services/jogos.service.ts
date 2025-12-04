import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JogoTabuleiro } from '../models/jogo-tabuleiro.model';

@Injectable({
  providedIn: 'root'
})
export class JogosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/jogos';

  // Agora retorna HttpResponse para pegarmos o cabeçalho 'X-Total-Count'
  listar(page: number, limit: number, search: string = ''): Observable<HttpResponse<JogoTabuleiro[]>> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    if (search) {
      params = params.set('q', search); // 'q' é a busca global do json-server
    }

    return this.http.get<JogoTabuleiro[]>(this.apiUrl, { 
      params, 
      observe: 'response' 
    });
  }

  buscarPorId(id: number): Observable<JogoTabuleiro> {
    return this.http.get<JogoTabuleiro>(`${this.apiUrl}/${id}`);
  }

  criar(jogo: any): Observable<JogoTabuleiro> {
    return this.http.post<JogoTabuleiro>(this.apiUrl, jogo);
  }

  atualizar(id: number, jogo: any): Observable<JogoTabuleiro> {
    return this.http.put<JogoTabuleiro>(`${this.apiUrl}/${id}`, jogo);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}