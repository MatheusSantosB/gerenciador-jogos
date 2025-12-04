import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = signal(false);
  private loadingMessage = signal('Carregando...');

  // Getters como signals
  readonly isLoadingSignal = this.isLoading.asReadonly();
  readonly messageSignal = this.loadingMessage.asReadonly();

  show(message: string = 'Carregando...') {
    this.loadingMessage.set(message);
    this.isLoading.set(true);
  }

  hide() {
    this.isLoading.set(false);
  }

  setMessage(message: string) {
    this.loadingMessage.set(message);
  }
}