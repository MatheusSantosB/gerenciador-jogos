import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import { JogosService } from '../../../services/jogos.service';
import { Categoria } from '../../../models/jogo-tabuleiro.model';

@Component({
  selector: 'app-jogos-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './jogos-form.component.html',
  styleUrl: './jogos-form.component.scss'
})
export class JogosFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private jogosService = inject(JogosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  isEdicao = signal(false);
  idEdicao: number | null = null;
  
  // Opções para o select baseadas no seu modelo
  categorias: Categoria[] = ['Estratégia', 'Familiar', 'Party', 'Cooperativo', 'Abstrato', 'Eurogame'];

  constructor() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      estoque: [0, [Validators.required, Validators.min(0)]],
      designer: ['', Validators.required],
      descricao: [''],
      complexidade: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      // Grupos aninhados para casar com a interface JogoTabuleiro
      numeroJogadores: this.fb.group({
        min: [1, [Validators.required, Validators.min(1)]],
        max: [4, [Validators.required, Validators.min(1)]],
        ideal: [4]
      }),
      tempoJogo: this.fb.group({
        min: [30, [Validators.required, Validators.min(1)]],
        max: [60, [Validators.required, Validators.min(1)]]
      })
    });
  }

  ngOnInit(): void {
    // Verifica se tem ID na URL para saber se é edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao.set(true);
      this.idEdicao = +id;
      this.carregarJogo(this.idEdicao);
    }
  }

  carregarJogo(id: number) {
    this.jogosService.buscarPorId(id).subscribe({
      next: (jogo) => {
        // Preenche o formulário com os dados do jogo
        this.form.patchValue(jogo);
      },
      error: (erro) => {
        console.error(erro);
        this.mostrarMensagem('Erro ao carregar dados do jogo', 'error-snackbar');
      }
    });
  }

  salvar() {
    if (this.form.invalid) return;

    const formularioValores = this.form.value;

    // Monta o objeto final garantindo campos obrigatórios que não estão no form
    const jogoParaSalvar = {
        ...formularioValores,
        // Define valores padrão para campos que não colocamos no form visual
        faixaEtaria: '10+', 
        disponivel: formularioValores.estoque > 0,
        tags: [],
        mecanicas: [],
        expansoes: [],
        imagemUrl: '',
        notaMedia: 0,
        editora: 'Própria',
        anoPublicacao: new Date().getFullYear()
    };

    if (this.isEdicao() && this.idEdicao) {
      this.jogosService.atualizar(this.idEdicao, jogoParaSalvar).subscribe({
        next: () => {
          this.mostrarMensagem('Jogo atualizado com sucesso!', 'success-snackbar');
          this.router.navigate(['/']);
        },
        error: () => this.mostrarMensagem('Erro ao atualizar jogo', 'error-snackbar')
      });
    } else {
      this.jogosService.criar(jogoParaSalvar).subscribe({
        next: () => {
          this.mostrarMensagem('Jogo criado com sucesso!', 'success-snackbar');
          this.router.navigate(['/']);
        },
        error: () => this.mostrarMensagem('Erro ao criar jogo', 'error-snackbar')
      });
    }
  }

  mostrarMensagem(msg: string, classe: string) {
    this.snackBar.open(msg, 'Fechar', { 
      duration: 3000, 
      panelClass: [classe] 
    });
  }
}