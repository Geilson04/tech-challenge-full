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

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais (FIAP Tech Challenge).
