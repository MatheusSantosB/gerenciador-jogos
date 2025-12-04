import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Jogo {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  designer: string;
  estoque: number;
  notaMedia: number;
  status: 'disponivel' | 'esgotado' | 'promocao';
  imagemUrl?: string;
  anoPublicacao?: number;
  complexidade?: number;
}

@Injectable({
  providedIn: 'root'
})
export class JogosService {
  private apiUrl = '/api/jogos';

  constructor(private http: HttpClient) {}

  getJogos(page = 1, limit = 10, filters?: any): Observable<Jogo[]> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<Jogo[]>(this.apiUrl, { params });
  }

  getJogoById(id: number): Observable<Jogo> {
    return this.http.get<Jogo>(`${this.apiUrl}/${id}`);
  }

  criarJogo(jogo: Jogo): Observable<Jogo> {
    return this.http.post<Jogo>(this.apiUrl, jogo);
  }

  atualizarJogo(id: number, jogo: Jogo): Observable<Jogo> {
    return this.http.put<Jogo>(`${this.apiUrl}/${id}`, jogo);
  }

  excluirJogo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTotalJogos(): Observable<number> {
    return this.http.head(this.apiUrl, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<Object>) => {
          const total = response.headers.get('X-Total-Count');
          return total ? parseInt(total, 10) : 0;
        })
      );
  }
}



