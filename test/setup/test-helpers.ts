import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface AdminLoginResponse {
  accessToken: string;
}

export interface UserLoginResponse {
  accessToken: string;
}

/**
 * 테스트용 관리자 생성
 */
export async function createTestAdmin(
  app: INestApplication,
  name: string = '관리자',
  password: string = 'password',
) {
  const prisma = app.get(PrismaService);
  const hashedPassword = await bcrypt.hash(password, 10);

  // 기존 관리자 확인
  const existingAdmin = await prisma.admin.findUnique({
    where: { name },
  });

  if (existingAdmin) {
    // 기존 관리자 비밀번호 업데이트
    return await prisma.admin.update({
      where: { name },
      data: {
        password: hashedPassword,
      },
    });
  }

  // 새 관리자 생성
  return await prisma.admin.create({
    data: {
      name,
      password: hashedPassword,
    },
  });
}

/**
 * 테스트용 미승인 사용자 생성 (이메일 인증 완료, 관리자 승인 미완료)
 */
export async function createUnapprovedTestUser(
  app: INestApplication,
  email?: string,
  password: string = 'password',
  name: string = '테스트사용자',
) {
  const prisma = app.get(PrismaService);
  const hashedPassword = await bcrypt.hash(password, 10);

  const userEmail = email || `test${Date.now()}-${Math.random().toString(36).substr(2, 9)}@snu.ac.kr`;

  // 기존 사용자 확인
  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (existingUser) {
    // 기존 사용자를 미승인 상태로 업데이트
    return await prisma.user.update({
      where: { email: userEmail },
      data: {
        password: hashedPassword,
        emailVerified: true,
        approvedByAdmin: false,
        approvedAt: null,
        approvedById: null,
      },
    });
  }

  // 새 사용자 생성 (미승인 상태) - ID는 Prisma가 자동으로 UUID 생성
  return await prisma.user.create({
    data: {
      email: userEmail,
      password: hashedPassword,
      name,
      emailVerified: true,
      approvedByAdmin: false,
      dateOfBirth: new Date('1990-01-01'),
      gender: 'MALE',
      height: 175.0,
      weight: 70.0,
      sido: '서울특별시',
      guGun: '강남구',
    },
  });
}

/**
 * 테스트용 사용자 생성 (이메일 인증 및 관리자 승인 완료)
 */
export async function createTestUser(
  app: INestApplication,
  email: string,
  password: string = 'password',
  name: string = '테스트사용자',
) {
  const prisma = app.get(PrismaService);
  const hashedPassword = await bcrypt.hash(password, 10);

  // 기존 사용자 확인
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // 기존 사용자 업데이트
    return await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        emailVerified: true,
        approvedByAdmin: true,
        approvedAt: new Date(),
        approvedById: existingUser.id,
      },
    });
  }

  // 새 사용자 생성 - ID는 Prisma가 자동으로 UUID 생성
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      emailVerified: true,
      approvedByAdmin: true,
      approvedAt: new Date(),
      dateOfBirth: new Date('1990-01-01'),
      gender: 'MALE',
      height: 175.0,
      weight: 70.0,
      sido: '서울특별시',
      guGun: '강남구',
    },
  });

  // 자기 자신을 승인자로 설정
  return await prisma.user.update({
    where: { id: newUser.id },
    data: {
      approvedById: newUser.id,
    },
  });
}

/**
 * 관리자 로그인하여 토큰을 발급받습니다.
 * 관리자가 존재하지 않으면 테스트용 관리자를 생성합니다.
 */
export async function getAdminToken(
  app: INestApplication,
  name: string = '관리자',
  password: string = 'password',
): Promise<string> {
  let response = await request(app.getHttpServer())
    .post('/api/v1/auth/admin/login')
    .send({ name, password });

  // 로그인 실패 시 테스트용 관리자 생성 후 재시도
  if (response.status !== 200) {
    try {
      await createTestAdmin(app, name, password);
      response = await request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send({ name, password });
    } catch (error) {
      // 관리자 생성 실패 시 에러 포함하여 throw
      throw new Error(
        `관리자 생성 및 로그인 실패: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  if (response.status !== 200) {
    throw new Error(
      `관리자 로그인 실패: ${response.status} - ${JSON.stringify(response.body)}`,
    );
  }

  return response.body.accessToken;
}

/**
 * 일반 사용자 로그인하여 토큰을 발급받습니다.
 * 사용자가 존재하지 않거나 로그인에 실패하면 테스트용 사용자를 생성합니다.
 */
export async function getUserToken(
  app: INestApplication,
  email: string,
  password: string = 'password',
  createIfNotExists: boolean = true,
): Promise<string> {
  let response = await request(app.getHttpServer())
    .post('/api/v1/auth/login')
    .send({ email, password });

  // 로그인 실패 시 테스트용 사용자 생성 후 재시도
  if (response.status !== 200 && createIfNotExists) {
    try {
      await createTestUser(app, email, password, '테스트사용자');
      response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email, password });
    } catch (error) {
      // 사용자 생성 실패는 무시하고 원래 에러 반환
    }
  }

  if (response.status !== 200) {
    throw new Error(
      `사용자 로그인 실패: ${response.status} - ${JSON.stringify(response.body)}`,
    );
  }

  return response.body.accessToken;
}

/**
 * 인증된 요청 헬퍼
 */
export function authenticatedRequest(
  app: INestApplication,
  method: 'get' | 'post' | 'patch' | 'delete' | 'put',
  url: string,
  token?: string,
) {
  const req = request(app.getHttpServer())[method](url);

  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }

  return req;
}
