/**
 * E2E 테스트 전용 환경변수 설정
 * 
 * 테스트 실행 시 자동으로 로드되어 테스트 전용 데이터베이스를 사용하도록 설정합니다.
 * 환경변수 DATABASE_URL이 이미 설정되어 있으면 그것을 사용하고,
 * 없으면 테스트 전용 데이터베이스 URL을 기본값으로 설정합니다.
 */

// 테스트 환경임을 명시
process.env.NODE_ENV = 'test';

// DATABASE_URL이 설정되지 않았으면 테스트 전용 데이터베이스 URL 사용
// Homebrew 설치의 경우 현재 사용자로 접속 (비밀번호 불필요)
if (!process.env.DATABASE_URL) {
  const currentUser = require('os').userInfo().username;
  process.env.DATABASE_URL =
    `postgresql://${currentUser}@localhost:5432/snu_healthing_you_test?schema=public`;
}

// 테스트 환경임을 확인하기 위한 로그 (선택사항)
if (process.env.JEST_VERBOSE === 'true') {
  console.log(`[E2E Test] Using DATABASE_URL: ${process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);
}

