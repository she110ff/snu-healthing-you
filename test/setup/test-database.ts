import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 테스트 데이터베이스 초기화
 * 주의: 실제 데이터를 삭제할 수 있으므로 테스트 환경에서만 사용
 */
export async function cleanDatabase() {
  // Foreign key 제약 조건으로 인해 역순으로 삭제
  await prisma.healthCheckup.deleteMany();
  await prisma.diseaseHistory.deleteMany();
  await prisma.interestGroup.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institutionConfig.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.emailVerification.deleteMany();
}

/**
 * 시드 데이터 생성
 */
export async function seedDatabase() {
  // seed.ts의 로직을 여기서 호출하거나
  // 테스트용 최소한의 데이터만 생성
}

/**
 * 테스트 후 정리
 */
export async function closeDatabase() {
  await prisma.$disconnect();
}


