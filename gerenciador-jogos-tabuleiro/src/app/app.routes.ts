import { Routes } from '@angular/router';
import { JogosListComponent } from './features/jogos/pages/jogos-list/jogos-list.component';
import { JogosFormComponent } from './features/jogos/jogos-form/jogos-form.component';

export const routes: Routes = [
  { path: '', component: JogosListComponent },
  { path: 'novo', component: JogosFormComponent },
  { path: 'editar/:id', component: JogosFormComponent },
  { path: '**', redirectTo: '' }
];