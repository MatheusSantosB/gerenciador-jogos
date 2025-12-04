import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { JogosService, Jogo } from '../../core/services/jogos.service';

@Component({
  selector: 'app-jogos-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './jogos-list.component.html',
  styleUrls: ['./jogos-list.component.scss']
})
export class JogosListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'categoria', 'designer', 'preco', 'estoque', 'nota', 'status', 'acoes'];
  dataSource: Jogo[] = [];
  
  totalJogos = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  
  searchTerm = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private jogosService: JogosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarJogos();
  }

  carregarJogos(): void {
    const filters: any = {};
    
    if (this.searchTerm) {
      filters.nome_like = this.searchTerm;
    }
    
    this.jogosService.getJogos(this.pageIndex + 1, this.pageSize, filters)
      .subscribe({
        next: (jogos: Jogo[]) => {
          this.dataSource = jogos;
        },
        error: (error: any) => {
          console.error('Erro ao carregar jogos:', error);
          this.mostrarMensagem('Erro ao carregar jogos', 'error');
        }
      });
    
    this.jogosService.getTotalJogos()
      .subscribe({
        next: (total: number) => {
          this.totalJogos = total;
        },
        error: (error: any) => {
          console.error('Erro ao obter total:', error);
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarJogos();
  }

  onSearch(): void {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.carregarJogos();
  }

  abrirDialogoExclusao(jogo: Jogo): void {
    const dialogData: ConfirmDialogData = {
      title: `Excluir "${jogo.nome}"`,
      message: `Tem certeza que deseja excluir permanentemente o jogo "${jogo.nome}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && jogo.id) {
        this.excluirJogo(jogo.id);
      }
    });
  }

  abrirDialogoEdicao(jogo: Jogo): void {
    const dialogData: ConfirmDialogData = {
      title: `Editar "${jogo.nome}"`,
      message: `Deseja editar as informações do jogo "${jogo.nome}"?`,
      confirmText: 'Editar',
      cancelText: 'Cancelar'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editarJogo(jogo);
      }
    });
  }

  excluirJogo(id: number): void {
    this.jogosService.excluirJogo(id)
      .subscribe({
        next: () => {
          this.mostrarMensagem('Jogo excluído com sucesso!');
          this.carregarJogos();
        },
        error: (error: any) => {
          console.error('Erro ao excluir jogo:', error);
          this.mostrarMensagem('Erro ao excluir jogo', 'error');
        }
      });
  }

  editarJogo(jogo: Jogo): void {
    this.mostrarMensagem(`Editando jogo: ${jogo.nome}`);
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'esgotado': return 'Esgotado';
      case 'promocao': return 'Promoção';
      default: return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'disponivel': return 'primary';
      case 'esgotado': return 'warn';
      case 'promocao': return 'accent';
      default: return '';
    }
  }

  mostrarMensagem(mensagem: string, tipo: 'success' | 'error' = 'success'): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  getTotalJogosCount(): number {
    return this.dataSource.length;
  }

  getJogosDisponiveis(): number {
    return this.dataSource.filter(jogo => jogo.estoque > 0).length;
  }

  getJogosEsgotados(): number {
    return this.dataSource.filter(jogo => jogo.estoque === 0).length;
  }

  getJogosPromocao(): number {
    return this.dataSource.filter(jogo => jogo.status === 'promocao').length;
  }
}
