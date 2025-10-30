import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('시드 데이터 생성 시작...');

  // 관리자 사용자 생성
  const admin = await prisma.user.upsert({
    where: { email: 'admin@snu.ac.kr' },
    update: {},
    create: {
      id: '59d70d42-639c-4d8f-92e9-cd659c1b03c0',
      email: 'admin@snu.ac.kr',
      password: '$2b$10$3qbKya2Vy7cQ8dKXqtUvzOD247FO45HVWRYetj73ML0XwD3c0WXQK',
      name: '관리자',
      role: 'ADMIN',
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
