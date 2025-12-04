import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Models e Services
import { JogoTabuleiro, Categoria } from '../../models/jogo-tabuleiro.model';
import { JogosService } from '../../services/jogos.service';
import { LoadingService } from '../../../../core/services/loading.service';

// Componentes
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-jogos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // Material Modules
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './jogos-list.component.html',
  styleUrl: './jogos-list.component.scss'
})
export class JogosListComponent implements OnInit {
  // Services
  private jogosService = inject(JogosService);
  private loadingService = inject(LoadingService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // Signals
  jogos = signal<JogoTabuleiro[]>([]);
  jogosFiltrados = signal<JogoTabuleiro[]>([]);
  categorias = signal<Categoria[]>([
    'Estratégia', 'Familiar', 'Party', 'Cooperativo', 'Abstrato', 'Eurogame'
  ]);
  
  // Filtros
  filtroNome = signal('');
  filtroCategoria = signal<string>('');
  filtroDisponivel = signal<boolean | null>(null);

  // Tabela
  displayedColumns: string[] = [
    'nome', 
    'categoria', 
    'jogadores', 
    'tempo', 
    'preco', 
    'complexidade',
    'estoque',
    'acoes'
  ];

  ngOnInit() {
    this.carregarJogos();
  }

  carregarJogos() {
    this.loadingService.show('Carregando jogos...');
    
    this.jogosService.listar().subscribe({
      next: (jogos) => {
        this.jogos.set(jogos);
        this.jogosFiltrados.set(jogos);
        this.loadingService.hide();
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar jogos', 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loadingService.hide();
        console.error('Erro:', error);
      }
    });
  }

  aplicarFiltros() {
    let filtrados = this.jogos();
    
    // Filtrar por nome
    if (this.filtroNome()) {
      const termo = this.filtroNome().toLowerCase();
      filtrados = filtrados.filter(jogo => 
        jogo.nome.toLowerCase().includes(termo) ||
        jogo.descricao.toLowerCase().includes(termo) ||
        jogo.tags.some(tag => tag.toLowerCase().includes(termo))
      );
    }
    
    // Filtrar por categoria
    if (this.filtroCategoria()) {
      filtrados = filtrados.filter(jogo => 
        jogo.categoria === this.filtroCategoria()
      );
    }
    
    // Filtrar por disponibilidade
    if (this.filtroDisponivel() !== null) {
      filtrados = filtrados.filter(jogo => 
        jogo.disponivel === this.filtroDisponivel()
      );
    }
    
    this.jogosFiltrados.set(filtrados);
  }

  limparFiltros() {
    this.filtroNome.set('');
    this.filtroCategoria.set('');
    this.filtroDisponivel.set(null);
    this.jogosFiltrados.set(this.jogos());
  }

  confirmarExclusao(jogo: JogoTabuleiro) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Confirmar Exclusão',
        mensagem: `Tem certeza que deseja excluir "${jogo.nome}"?`,
        textoConfirmar: 'Excluir',
        textoCancelar: 'Cancelar',
        corConfirmar: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.excluirJogo(jogo.id);
      }
    });
  }

  excluirJogo(id: number) {
    this.loadingService.show('Excluindo jogo...');
    
    this.jogosService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Jogo excluído com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        // Atualizar lista
        const novosJogos = this.jogos().filter(jogo => jogo.id !== id);
        this.jogos.set(novosJogos);
        this.jogosFiltrados.set(novosJogos);
        
        this.loadingService.hide();
      },
      error: (error) => {
        this.snackBar.open('Erro ao excluir jogo', 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loadingService.hide();
        console.error('Erro:', error);
      }
    });
  }

  formatarJogadores(jogo: JogoTabuleiro): string {
    const { min, max } = jogo.numeroJogadores;
    return min === max ? `${min}` : `${min}-${max}`;
  }

  formatarTempo(jogo: JogoTabuleiro): string {
    const { min, max } = jogo.tempoJogo;
    return min === max ? `${min} min` : `${min}-${max} min`;
  }

  formatarComplexidade(nivel: number): string {
    const estrelas = '★'.repeat(nivel);
    const vazias = '☆'.repeat(5 - nivel);
    return estrelas + vazias;
  }
}