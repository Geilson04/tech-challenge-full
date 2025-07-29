# Projeto: Tech Challenge Fase 2

## Sumário
- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Setup Inicial](#setup-inicial)
- [Arquitetura da Aplicação](#arquitetura-da-aplicação)
- [APIs Disponíveis](#apis-disponíveis)
  - [Rotas de Postagens](#rotas-de-postagens)
- [Testes](#testes)
- [Scripts Disponíveis](#scripts-disponíveis)

## Visão Geral
Este projeto é uma aplicação backend desenvolvida utilizando **Node.js**, **Express** e **Prisma** para gerenciar postagens de um blog. Ele utiliza um banco de dados PostgreSQL e é containerizado com **Docker**. A aplicação segue uma arquitetura modular e organizada em camadas, incluindo controllers, services e models.

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução para o JavaScript.
- **Express**: Framework web para criar a API REST.
- **Prisma**: ORM para interagir com o banco de dados.
- **Knex**: Ferramenta para realizar migrações no banco de dados.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.
- **Docker**: Para containerização da aplicação.
- **TypeScript**: Linguagem principal usada no projeto.

## Setup Inicial

### Requisitos
- **Node.js** versão 18 ou superior.
- **Docker** e **Docker Compose** instalados.

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/tech-challenge-fase2.git
   cd tech-challenge-fase2
2. Instale as dependências do projeto:
   ```bash
   npm install
3. Construa os containers usando Docker Compose:
   ```bash
   docker compose up --build
- Isso irá subir tanto o backend quanto o banco de dados PostgreSQL automaticamente.
4. Execute as migrações para criar as tabelas no banco de dados:
   ```bash
   docker compose run backend npm run db:migrate
5. Para popular o banco de dados com dados de exemplo, execute:
   ```bash
   docker compose run backend npm run docker:seed:dev

### Executando a Aplicação
1. Após construir os containers, a aplicação estará disponível automaticamente em:
   ```bash
   http://localhost:5000
2. O banco de dados PostgreSQL estará disponível na porta 5432 do host.

### Variáveis de Ambiente
As variáveis de ambiente já estão configuradas no arquivo docker-compose.yml, incluindo:
- DATABASE_URL: URL de conexão com o PostgreSQL no container.
- PORT: Porta onde o backend será exposto (5000).

## Arquitetura da Aplicação

A aplicação é organizada em diferentes camadas para separar responsabilidades, conforme descrito abaixo:

### 1. **Controllers**
   - Responsáveis por lidar com as requisições HTTP e invocar as funções dos **Services**.
   - Localização: `src/controllers`

### 2. **Services**
   - Contêm a lógica de negócio. Chamam os métodos definidos nos **Models** para interagir com o banco de dados.
   - Localização: `src/services`

### 3. **Models**
   - Realizam a comunicação com o banco de dados utilizando o **Prisma**.
   - Localização: `src/models`

### 4. **Rotas**
   - Definem as rotas da API e as associam aos seus respectivos controllers.
   - Localização: `src/routes`

### 5. **Banco de Dados**
   - Utiliza **PostgreSQL** como sistema de banco de dados relacional.
   - O arquivo `schema.prisma` define o modelo de dados usado pela aplicação.

## APIs Disponíveis

### Rotas de Postagens

#### `GET /posts`
- **Descrição**: Retorna todas as postagens.
- **Resposta**:
  ```json
  [
    {
      "id": "string",
      "slug": "string",
      "title": "string",
      "content": "string",
      "author": "string",
      "publishedAt": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]

#### `GET /posts/:id`
- **Descrição**: Retorna uma postagem pelo seu ID.
- **Parâmetros**: `id` (string): ID da postagem.
- **Resposta**:
  ```json
  [
    {
      "id": "string",
      "slug": "string",
      "title": "string",
      "content": "string",
      "author": "string",
      "publishedAt": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]

#### `POST /posts`
- **Descrição**: Cria uma nova postagem.
- **Parâmetros**: `title` (string): Título da postagem. `content` (string, opcional): Conteúdo da postagem. `author` (string): Autor da postagem.
- **Exemplo de Corpo da Requisição**:
  ```json
  {
    "title": "Meu Novo Post",
    "content": "Este é o conteúdo do post.",
    "author": "Autor Desconhecido"
  }
- **Resposta**:
  ```json
  {
    "id": "string",
    "slug": "meu-novo-post",
    "title": "Meu Novo Post",
    "content": "Este é o conteúdo do post.",
    "author": "Autor Desconhecido",
    "publishedAt": "date",
    "createdAt": "date",
    "updatedAt": "date"
  }

#### `PUT /posts/:id`
- **Descrição**: Atualiza uma postagem existente pelo ID.
- **Parâmetros**: `id` (string): ID da postagem.
- **Exemplo de Corpo da Requisição**:
  ```json
  {
    "title": "Novo Título"
  }
- **Resposta**:
  ```json
  {
    "id": "string",
    "slug": "novo-titulo",
    "title": "Novo Título",
    "content": "Este é o conteúdo do post.",
    "author": "Autor Desconhecido",
    "publishedAt": "date",
    "createdAt": "date",
    "updatedAt": "date"
  }

#### `DELETE /posts/:id`
- **Descrição**: Remove uma postagem pelo ID.
- **Parâmetros**: `q` (string): Termo de busca.
- **Resposta**:
  ```json
  [
    {
      "id": "string",
      "slug": "string",
      "title": "string",
      "content": "string",
      "author": "string",
      "publishedAt": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]

## Testes
Os testes foram escritos usando **Jest** e estão localizados na pasta `src/controllers/__tests__`. Eles testam as funcionalidades dos controllers da aplicação, garantindo que as rotas estejam funcionando corretamente.

### Executar Testes
1. Para executar os testes unitários, utilize o seguinte comando:
   ```bash
   npm run test
2. Instale as dependências do projeto:
   ```bash
   npm install

### Cobertura de Testes
1. Para visualizar a cobertura de testes, execute o comando abaixo:
   ```bash
   npm run test:coverage
- Isso gerará um relatório de cobertura para que você possa identificar quais partes do código estão cobertas pelos testes.

## Scripts Disponíveis
Os scripts abaixo podem ser executados para diferentes funcionalidades no projeto:
- `npm run start`: Inicia o servidor localmente (após compilar - arquivo .env é necessário com a DATABASE_URL).
- `npm run build`: Compila o código TypeScript para JavaScript na pasta dist.
- `npm run db:migrate`: Executa as migrações do banco de dados.
- `npm run docker:seed:dev`: Popula o banco de dados com dados de exemplo no ambiente Docker.
- `npm run test`: Executa os testes unitários.
- `npm run test:coverage`: Executa os testes e gera um relatório de cobertura.
- `npm run watch`: Assiste as mudanças no código e reinicia o container backend automaticamente.
