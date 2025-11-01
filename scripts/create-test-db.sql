-- 테스트 데이터베이스 생성 SQL 스크립트
-- 사용법: psql -U postgres -f scripts/create-test-db.sql

-- 기존 데이터베이스가 있으면 삭제 (주의: 모든 데이터가 삭제됩니다)
DROP DATABASE IF EXISTS snu_healthing_you_test;

-- 테스트 데이터베이스 생성
CREATE DATABASE snu_healthing_you_test;

-- 완료 메시지
\echo '✅ 테스트 데이터베이스 "snu_healthing_you_test" 생성 완료!'
\echo ''
\echo '다음 단계:'
\echo '  DATABASE_URL="postgresql://postgres:postgres@localhost:5432/snu_healthing_you_test?schema=public" npx prisma migrate deploy'

