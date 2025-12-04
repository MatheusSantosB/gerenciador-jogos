import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable(); // O erro reclamava que isso faltava

  show(message?: string) {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }
}