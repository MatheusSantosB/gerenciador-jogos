import { Routes } from '@angular/router';
import { JogosListComponent } from './pages/jogos-list/jogos-list.component';

export const routes: Routes = [
  { path: '', component: JogosListComponent },
  { path: '**', redirectTo: '' }
];
