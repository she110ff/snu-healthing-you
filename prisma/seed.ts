import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('시드 데이터 생성 시작...');

  // 관리자 사용자 생성
  const admin = await prisma.user.upsert({
    where: { email: 'admin@snu.ac.kr' },
    update: {
      // 업데이트 시에도 상태 필드 유지
      emailVerified: true,
      approvedByAdmin: true,
      approvedAt: new Date(),
      approvedById: '59d70d42-639c-4d8f-92e9-cd659c1b03c0', // 자기 자신을 승인자로 설정
    },
    create: {
      id: '59d70d42-639c-4d8f-92e9-cd659c1b03c0',
      email: 'admin@snu.ac.kr',
      password: '$2b$10$3qbKya2Vy7cQ8dKXqtUvzOD247FO45HVWRYetj73ML0XwD3c0WXQK',
      name: '관리자',
      role: 'ADMIN',
      emailVerified: true, // 관리자는 이메일 인증 완료 상태
      approvedByAdmin: true, // 관리자는 자동 승인 상태
      approvedAt: new Date('2025-10-30T17:24:07.837Z'),
      approvedById: '59d70d42-639c-4d8f-92e9-cd659c1b03c0', // 자기 자신을 승인자로 설정
      createdAt: new Date('2025-10-30T17:24:07.837Z'),
      updatedAt: new Date('2025-10-30T17:24:07.837Z'),
    },
  });

  console.log('관리자 사용자 생성 완료:', admin);
}

main()
  .catch((e) => {
    console.error('시드 데이터 생성 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
