# 🎲 Gerenciador de Jogos de Tabuleiro

Uma aplicação web desenvolvida em **Angular** para gerenciar uma coleção de jogos de tabuleiro. O projeto permite listar, adicionar, editar e excluir jogos, utilizando uma API simulada (Mock) para persistência dos dados.

## ✨ Funcionalidades

- **Listagem de Jogos:** Visualização em tabela com paginação.
- **Busca e Filtragem:** Pesquisa em tempo real por nome do jogo ou designer.
- **CRUD Completo:**
  - **Criar:** Formulário para adicionar novos jogos com detalhes como preço, categoria e estoque.
  - **Ler:** Visualização detalhada na lista.
  - **Atualizar:** Edição de informações de jogos existentes.
  - **Deletar:** Remoção de jogos com diálogo de confirmação.
- **Interface Responsiva:** Utilizando **Angular Material** para um design moderno e limpo.
- **Feedback Visual:** Loadings e notificações (Snackbars) para ações do usuário.

## 🚀 Tecnologias Utilizadas

- **Frontend:** [Angular v20](https://angular.io/)
- **UI Components:** [Angular Material](https://material.angular.io/)
- **Backend (Simulado):** [JSON Server](https://github.com/typicode/json-server)
- **Gerenciamento de Pacotes:** NPM
- **Utilitários:** RxJS, Concurrently

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Angular CLI](https://angular.io/cli) (Opcional, mas recomendado: `npm install -g @angular/cli`)

## 🔧 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/gerenciador-jogos.git
   cd gerenciador-jogos/gerenciador-jogos-tabuleiro
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Ajuste Importante (JSON Server):** Para garantir que a paginação funcione corretamente, certifique-se de estar usando a versão estável do `json-server`:
   ```bash
   npm install json-server@0.17.4 --save-dev
   ```

## ▶️ Como Rodar o Projeto

Existem duas formas de rodar o projeto.

### Opção 1: Comando Único (Recomendado)

O projeto está configurado para rodar o Frontend e o Backend simultaneamente com um único comando:

```bash
npm run dev
```

Isso iniciará:
- A API em `http://localhost:3001`
- A Aplicação em `http://localhost:4200`

### Opção 2: Terminais Separados

Se preferir, você pode rodar os serviços individualmente em dois terminais diferentes:

**Terminal 1 (Backend/API):**
```bash
npm run server
```

**Terminal 2 (Frontend/Angular):**
```bash
npm start
```

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura organizada por funcionalidades (features):

```
src/app/
├── core/               # Serviços globais (ex: loading.service.ts)
├── features/
│   └── jogos/          # Módulo principal de Jogos
│       ├── jogos-form/ # Componente de criação/edição
│       ├── models/     # Interfaces (Typescript)
│       ├── pages/      # Páginas (ex: jogos-list)
│       └── services/   # Lógica de comunicação com API
├── shared/             # Componentes reutilizáveis (ex: confirm-dialog)
└── environments/       # Configurações de ambiente
```

## 📝 API (db.json)

A API é simulada através do arquivo `db.json`. Os dados principais são:

- **id:** Identificador único
- **nome:** Título do jogo
- **categoria:** (Estratégia, Familiar, Party, etc.)
- **preco:** Valor em reais
- **estoque:** Quantidade disponível
- **designer:** Criador do jogo
- **descricao:** Detalhes sobre o jogo

## 🤝 Contribuindo

1. Faça um **Fork** do projeto
2. Crie sua **Feature Branch** (`git checkout -b feature/MinhaFeature`)
3. Faça o **Commit** das suas mudanças (`git commit -m 'Adicionando nova feature'`)
4. Faça o **Push** para a Branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

---

Desenvolvido com 💙 por Matheus Santos
