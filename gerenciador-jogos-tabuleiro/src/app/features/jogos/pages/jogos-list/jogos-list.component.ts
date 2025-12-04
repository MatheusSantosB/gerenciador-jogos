import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material Imports
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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

import { JogoTabuleiro } from '../../models/jogo-tabuleiro.model';
import { JogosService } from '../../services/jogos.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-jogos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './jogos-list.component.html',
  styleUrl: './jogos-list.component.scss'
})
export class JogosListComponent implements OnInit {
  private jogosService = inject(JogosService);
  protected loadingService = inject(LoadingService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // Variáveis exigidas pelo HTML
  dataSource: JogoTabuleiro[] = [];
  totalJogos = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];
  searchTerm = '';

  displayedColumns: string[] = ['nome', 'categoria', 'preco', 'estoque', 'acoes'];

  ngOnInit() {
    this.carregarJogos();
  }

  carregarJogos() {
    this.loadingService.show();
    
    // Chama o serviço passando página, limite e termo de busca
    this.jogosService.listar(this.pageIndex + 1, this.pageSize, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.dataSource = response.body || [];
          const totalHeader = response.headers.get('X-Total-Count');
          this.totalJogos = totalHeader ? Number(totalHeader) : 0;
          this.loadingService.hide();
        },
        error: (error) => {
          console.error('Erro ao carregar jogos:', error);
          this.mostrarMensagem('Erro ao carregar jogos', 'error-snackbar');
          this.loadingService.hide();
        }
      });
  }

  onSearch() {
    this.pageIndex = 0; // Volta para a primeira página ao pesquisar
    this.carregarJogos();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarJogos();
  }

  abrirDialogoExclusao(jogo: JogoTabuleiro) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir "${jogo.nome}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.excluirJogo(jogo.id);
      }
    });
  }

  excluirJogo(id: number) {
    this.loadingService.show();
    this.jogosService.deletar(id).subscribe({
      next: () => {
        this.mostrarMensagem('Jogo excluído com sucesso!', 'success-snackbar');
        this.carregarJogos(); // Recarrega a lista para refletir a exclusão
      },
      error: () => {
        this.mostrarMensagem('Erro ao excluir jogo', 'error-snackbar');
        this.loadingService.hide();
      }
    });
  }

  mostrarMensagem(msg: string, classe: string) {
    this.snackBar.open(msg, 'Fechar', {
      duration: 3000,
      panelClass: [classe],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}