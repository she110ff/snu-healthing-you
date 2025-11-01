#!/bin/bash

# 테스트 데이터베이스 생성 스크립트
# 사용법: ./scripts/create-test-db.sh

set -e

echo "🔍 PostgreSQL 연결 확인 중..."

# 현재 사용자 확인 (Homebrew 설치의 경우 현재 사용자를 사용)
DB_USER=$(whoami)

# PostgreSQL 연결 테스트 (postgres 사용자 먼저 시도, 실패하면 현재 사용자 사용)
if psql -U postgres -d postgres -c '\q' 2>/dev/null; then
    DB_USER="postgres"
elif ! psql -d postgres -c '\q' 2>/dev/null; then
    echo "❌ PostgreSQL에 연결할 수 없습니다."
    echo ""
    echo "다음 중 하나를 확인하세요:"
    echo "1. PostgreSQL이 설치되어 있는지 확인"
    echo "2. psql이 PATH에 있는지 확인"
    echo "3. PostgreSQL 서비스가 실행 중인지 확인"
    echo ""
    echo "macOS에서 PostgreSQL 설치:"
    echo "  brew install postgresql@14"
    echo "  brew services start postgresql@14"
    echo ""
    echo "또는 Docker를 사용하는 경우:"
    echo "  docker run --name postgres-test -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL 연결 확인됨 (사용자: $DB_USER)"
echo ""

# 데이터베이스 존재 여부 확인
if [ "$DB_USER" = "postgres" ]; then
    DB_EXISTS=$(psql -U postgres -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='snu_healthing_you_test'")
else
    DB_EXISTS=$(psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='snu_healthing_you_test'")
fi

if [ "$DB_EXISTS" = "1" ]; then
    echo "⚠️  테스트 데이터베이스 'snu_healthing_you_test'가 이미 존재합니다."
    read -p "삭제하고 다시 생성하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  기존 데이터베이스 삭제 중..."
        if [ "$DB_USER" = "postgres" ]; then
            psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS snu_healthing_you_test;"
        else
            psql -d postgres -c "DROP DATABASE IF EXISTS snu_healthing_you_test;"
        fi
    else
        echo "ℹ️  기존 데이터베이스를 사용합니다."
        exit 0
    fi
fi

echo "📦 테스트 데이터베이스 생성 중..."
if [ "$DB_USER" = "postgres" ]; then
    psql -U postgres -d postgres -c "CREATE DATABASE snu_healthing_you_test;"
    DB_URL="postgresql://postgres:postgres@localhost:5432/snu_healthing_you_test?schema=public"
else
    psql -d postgres -c "CREATE DATABASE snu_healthing_you_test;"
    DB_URL="postgresql://$DB_USER@localhost:5432/snu_healthing_you_test?schema=public"
fi

echo "✅ 테스트 데이터베이스 'snu_healthing_you_test' 생성 완료!"
echo ""
echo "다음 단계:"
echo "  DATABASE_URL=\"$DB_URL\" npx prisma migrate deploy"
echo "또는"
echo "  npm run test:db:migrate"
echo ""

