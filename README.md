# Tech Challenge Fase 2 - Backend (Node.js + Express)

## 📌 Sobre o Projeto

Este projeto é um **backend em Node.js** desenvolvido com **Express**, **TypeScript**, **Prisma** (PostgreSQL) e **Knex** para migrações. Ele expõe uma API REST para gerenciar **usuários** e **postagens de blog**.  
Foi estruturado em camadas (controllers, services, models) e está pronto para execução via **Docker Compose**.

---

## 🚀 Tecnologias

- **Node.js** 18+
- **Express**
- **TypeScript**
- **Prisma ORM** (com suporte a PostgreSQL)
- **Knex** (migrações do banco)
- **Docker & Docker Compose**
- **Jest** (testes unitários)

---

## 📦 Instalação e Execução

### 1. Requisitos

- [Node.js 18+](https://nodejs.org)
- [Docker & Docker Compose](https://www.docker.com/)
- Portas **5000** (API) e **5432** (Postgres) livres

---

### 2. Rodando com Docker (recomendado)

```bash
# Clonar repositório
git clone <URL_DO_REPO>
cd tech-challenge-fase2-master

# Subir containers
docker compose up --build -d

# Executar migrações
docker compose run --rm backend npm run db:migrate

# Popular banco com dados de exemplo (opcional)
docker compose run --rm backend npm run docker:seed:dev
```

A API estará disponível em:  
👉 **http://localhost:5000**

Banco de dados:  
- Host: `localhost`
- Porta: `5432`
- DB: `posts_db`
- User: `postgres`  
- Pass: `postgres`

---

### 3. Rodando localmente (sem Docker)

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente (.env)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/posts_db
JWT_SECRET=sua_chave_segura

# Gerar Prisma Client
npx prisma generate

# Rodar migrações e seed
npm run db:migrate
npm run seed:dev

# Build e start
npm run build
npm start
```

---

## 🌱 Dados iniciais (seed)

O comando `npm run docker:seed:dev` cria usuários e posts iniciais.  

### Usuários criados (senha padrão **admin**)

- `sadi.carnot@example.com`
- `fiodor.d@example.com`
- `nietzsche@example.com`
- `virginia.woolf@example.com`
- `homer@example.com`

---

## 🔗 Endpoints principais
### Endpoints

```http
GET /posts
Descrição: Lista de todos os posts disponíveis.
Acesso: Alunos e Professores
RespostaDoJson:
  {
    "id": 1,
    "titulo": "Titulo da aula",
    "conteudo": "Conteúdo da aula",
    "id_autor": 3,
    "data_criacao": "2025-07-24T12:00:00Z"
  }
```

```http
GET /posts/:id
Descrição: Retorna os detalhes de um post específico.
Acesso: Alunos e Professores.
```

```http
POST /posts
Descrição: Cria uma nova postagem.
Acesso: Professores
BodyDoJson:
  {
    "titulo": "Titulo da aula nova",
    "conteudo": "Conteúdo da aula nova",
    "id_autor": 3
  }
```

```http
PUT /posts/:id
Descrição: Edita uma postagem existente.
Acesso: Professores
RespostaDoJson:
  {
    "titulo": "Titulo da aula atualizado",
    "conteudo": "Conteúdo da aula atualizado"
  }
```

```http
DELETE /posts/:id
Descrição: Exclui uma postagem.
Acesso: Professores
```

```http
GET /posts/search?q=termo
Descrição: Busca posts por palavra-chave no título ou conteúdo.
Exemplo: /posts/search?q=atualizado
RespostaDoJson:
  {
    "id": 2,
    "titulo": "Titulo da aula atualizado",
    "conteudo": "Conteúdo da aula atualizado"
  }
```

### Autenticação

```http
POST /signup        # Criar usuário
POST /login         # Login e obtenção de token JWT
```

### Usuários

```http
GET    /users
PUT    /users/:id
DELETE /users/:id
```

### Postagens

```http
GET    /posts
GET    /posts/:id
GET    /posts/search?q=termo
POST   /posts
PUT    /posts/:id
DELETE /posts/:id
```
---

## Estrutura do Banco de Dados

### Tabela: Professores
| Campo | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | Identificador único |
| nome | VARCHAR | Nome completo |
| email | VARCHAR | E-mail para login |
| senha | VARCHAR | Senha criptografada |
| disciplina | VARCHAR | (opcional) Área de atuação |
| telefone | VARCHAR | (opcional) |
| data_cadastro | DATETIME | Registro de data de criação |
| ativo | BOOLEAN | Conta ativa? (true/false) |


### Tabela: Alunos
| Campo | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | Identificador único |
| nome | VARCHAR | Nome completo |
| email | VARCHAR | E-mail para login |
| senha | VARCHAR | Senha criptografada |
| curso | VARCHAR | (opcional) Curso matriculado |
| telefone | VARCHAR | (opcional) |
| data_nascimento | DATE | (opcional) |
| data_cadastro | DATETIME | Registro de data de criação |
| ativo | BOOLEAN | Conta ativa? (true/false) |


### Tabela: Posts
| Campo | Tipo | Descrição |
|---|---|---|
| id | INT (PK) | Identificador único |
| titulo | VARCHAR | Título da postagem |
| conteudo | TEXT | Corpo do post |
| id_autor | INT (FK) | ID do professor que criou (→ professores) |
| data_criacao | DATETIME | Data em que foi criado |
| data_atualiacao | DATETIME | Última modificação |

---

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com relatório de cobertura
npm run test:coverage
```

---

## 📜 Exemplos de uso (cURL)

### 1. Login

```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sadi.carnot@example.com","password":"admin"}'
```

### 2. Criar um post

```bash
curl -X POST http://localhost:5000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "Introdução à Termodinâmica",
    "content": "Primeiros conceitos de sistemas e propriedades...",
    "author": "Sadi Carnot"
  }'
```

### 3. Listar posts

```bash
curl http://localhost:5000/posts \
  -H "Authorization: Bearer <TOKEN>"
```

---

## ⚠️ Observações

- No modo Docker, os dados **não são persistidos** entre reinícios se você não adicionar volumes no `docker-compose.yml`.  
- Para produção, configure corretamente as variáveis de ambiente (`DATABASE_URL`, `JWT_SECRET` etc.).

---

## 🤖 Integração Contínua (CI) com GitHub Actions

Este projeto conta com um pipeline de **Integração Contínua** configurado com **GitHub Actions**, que executa automaticamente:

- Instalação de dependências (`npm install`)
- Execução dos testes (`npm test`)
- Validação da aplicação a cada push ou pull request

O workflow está configurado para atuar sobre a pasta `tech-challenge-fase2-master`, onde reside o código-fonte da aplicação.

### 🔍 Status do pipeline

![CI](https://github.com/SEU_USUARIO/SEU_REPOSITORIO/actions/workflows/main.yml/badge.svg)


---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais (FIAP Tech Challenge).
