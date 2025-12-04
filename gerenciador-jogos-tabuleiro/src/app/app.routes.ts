import { Routes } from '@angular/router';
import { JogosListComponent } from './features/jogos/pages/jogos-list/jogos-list.component';
import { JogosFormComponent } from './pages/jogos-form/jogos-form.component';
export const routes: Routes = [
  // Rota inicial: Lista de jogos
  { path: '', component: JogosListComponent },
  
  // Rota para criar um novo jogo
  { path: 'novo', component: JogosFormComponent },
  
  // Rota para editar um jogo existente (o :id é dinâmico)
  { path: 'editar/:id', component: JogosFormComponent },
  
  // Qualquer outra rota inválida redireciona para a lista
  { path: '**', redirectTo: '' }
];