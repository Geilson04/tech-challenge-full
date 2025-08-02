#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# setup.sh - Inicializa o ambiente Docker + Postgres, migrações e seed
# Uso: bash setup.sh
# Requisitos: Docker Desktop (com WSL2) e docker compose
# -----------------------------------------------------------------------------

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Verificando docker compose..."
if ! command -v docker &>/dev/null; then
  echo "ERRO: Docker não encontrado no PATH."
  exit 1
fi
if ! docker compose version &>/dev/null; then
  echo "ERRO: 'docker compose' (v2) não disponível. Atualize o Docker Desktop."
  exit 1
fi

cd "$PROJECT_ROOT"

# 1) Criar .env se não existir
if [[ ! -f .env ]]; then
  echo "==> Criando .env padrão..."
  cat > .env <<'EOF'
# ====== .env (uso com Docker) ======
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/posts_db
PORT=5000
JWT_SECRET=qwerty123
EOF
else
  echo "==> .env já existe. Mantendo arquivo atual."
fi

# 2) Subir somente o Postgres
echo "==> Subindo serviço Postgres..."
docker compose up -d --build postgres

# 2.1) Aguardar Postgres ficar saudável
echo "==> Aguardando Postgres (healthcheck)..."
# Até 60 tentativas (~60s)
for i in $(seq 1 60); do
  if docker compose exec -T postgres pg_isready -U postgres -d posts_db >/dev/null 2>&1; then
    echo "    Postgres está pronto."
    break
  fi
  sleep 1
  if [[ $i -eq 60 ]]; then
    echo "ERRO: Postgres não ficou pronto a tempo."
    docker compose logs postgres | tail -n 200 || true
    exit 1
  fi
done

# 3) Garantir extensões necessárias
echo '==> Criando extensões uuid-ossp e unaccent (se necessário)...'
docker compose exec -T postgres psql -U postgres -d posts_db -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
docker compose exec -T postgres psql -U postgres -d posts_db -c 'CREATE EXTENSION IF NOT EXISTS unaccent;'

# 4) Rodar migrações e seed via container backend efêmero
echo "==> Rodando migrações (Knex)..."
docker compose run --rm backend npm run db:migrate

echo "==> Rodando seed de desenvolvimento..."
docker compose run --rm backend npm run seed:dev

# 5) Subir o backend em background
echo "==> Subindo backend..."
docker compose up -d --build backend

echo "==> Status dos serviços:"
docker compose ps

# 6) Teste rápido (opcional)
echo "==> Testando endpoint /posts..."
set +e
curl -fsS http://localhost:5000/posts >/dev/null
RET=$?
set -e
if [[ $RET -eq 0 ]]; then
  echo "OK: API respondeu em http://localhost:5000"
else
  echo "Aviso: Não foi possível confirmar a API agora. Verifique logs com:"
  echo "  docker compose logs -f backend"
fi

echo "==> Pronto! Endpoints disponíveis em http://localhost:5000"
