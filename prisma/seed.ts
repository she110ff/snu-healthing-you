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
      dateOfBirth: new Date('1990-01-01'),
      gender: 'MALE',
      height: 175.0,
      weight: 70.0,
      sido: '서울특별시',
      guGun: '관악구',
      createdAt: new Date('2025-10-30T17:24:07.837Z'),
      updatedAt: new Date('2025-10-30T17:24:07.837Z'),
    },
  });

  console.log('관리자 사용자 생성 완료:', admin);

  // user2 생성
  const user2 = await prisma.user.upsert({
    where: { email: 'user2@snu.ac.kr' },
    update: {
      emailVerified: true,
      approvedByAdmin: true,
      approvedAt: new Date(),
      approvedById: admin.id,
    },
    create: {
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      email: 'user2@snu.ac.kr',
      password: '$2b$10$3qbKya2Vy7cQ8dKXqtUvzOD247FO45HVWRYetj73ML0XwD3c0WXQK', // password: "password"
      name: '사용자2',
      role: 'USER',
      emailVerified: true,
      approvedByAdmin: true,
      approvedAt: new Date(),
      approvedById: admin.id,
      dateOfBirth: new Date('1985-05-15'),
      gender: 'FEMALE',
      height: 165.0,
      weight: 60.0,
      sido: '서울특별시',
      guGun: '강남구',
      createdAt: new Date('2025-10-30T18:00:00.000Z'),
      updatedAt: new Date('2025-10-30T18:00:00.000Z'),
    },
  });

  console.log('user2 사용자 생성 완료:', user2);

  // user2의 건강검진 데이터 생성 (여러 개 가능)
  const healthCheckup1 = await prisma.healthCheckup.upsert({
    where: { id: 'h1-health-checkup-user2-001' },
    update: {},
    create: {
      id: 'h1-health-checkup-user2-001',
      userId: user2.id,
      checkupDate: new Date('2024-06-15'),
      bmi: 22.03,
      waistCircumference: 75.0,
      systolicBloodPressure: 125,
      diastolicBloodPressure: 82,
      totalCholesterol: 215,
      hdlCholesterol: 65,
      ldlCholesterol: 130,
      triglycerides: 150,
      hemoglobin: 13.5,
      ast: 28,
      alt: 22,
      serumCreatinine: 0.9,
      glomerularFiltrationRate: 95.0,
      createdAt: new Date('2024-06-15T10:00:00.000Z'),
      updatedAt: new Date('2024-06-15T10:00:00.000Z'),
    },
  });

  const healthCheckup2 = await prisma.healthCheckup.upsert({
    where: { id: 'h2-health-checkup-user2-002' },
    update: {},
    create: {
      id: 'h2-health-checkup-user2-002',
      userId: user2.id,
      checkupDate: new Date('2024-12-10'),
      bmi: 21.8,
      waistCircumference: 73.0,
      systolicBloodPressure: 118,
      diastolicBloodPressure: 78,
      totalCholesterol: 205,
      hdlCholesterol: 68,
      ldlCholesterol: 120,
      triglycerides: 140,
      hemoglobin: 13.8,
      ast: 25,
      alt: 20,
      serumCreatinine: 0.85,
      glomerularFiltrationRate: 98.0,
      createdAt: new Date('2024-12-10T10:00:00.000Z'),
      updatedAt: new Date('2024-12-10T10:00:00.000Z'),
    },
  });

  console.log(
    'user2 건강검진 데이터 생성 완료:',
    healthCheckup1,
    healthCheckup2,
  );

  // user2의 질환 이력 데이터 생성 (하나만 가능)
  const diseaseHistory = await prisma.diseaseHistory.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      chronicDiseases: ['이상지질혈증', '고혈압'],
      chronicRespiratoryDiseases: [],
      chronicRespiratoryOther: null,
      chronicArthritis: [],
      osteoarthritis: null,
      chronicArthritisOther: null,
      pastChronicDiseases: [],
      cancerHistory: [],
      cancerOther: null,
      isSmoking: 'NO',
      isDrinking: 'YES',
      createdAt: new Date('2024-06-15T11:00:00.000Z'),
      updatedAt: new Date('2024-06-15T11:00:00.000Z'),
    },
  });

  console.log('user2 질환 이력 데이터 생성 완료:', diseaseHistory);

  // user2의 관심 그룹 데이터 생성 (하나만 가능)
  const interestGroup = await prisma.interestGroup.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      group: 'HYPERTENSION_MANAGEMENT',
      createdAt: new Date('2024-06-15T11:30:00.000Z'),
      updatedAt: new Date('2024-06-15T11:30:00.000Z'),
    },
  });

  console.log('user2 관심 그룹 데이터 생성 완료:', interestGroup);
}

main()
  .catch((e) => {
    console.error('시드 데이터 생성 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
