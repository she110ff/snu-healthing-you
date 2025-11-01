import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { createTestUser } from '../setup/test-helpers';
import { userFixtures } from '../fixtures/user.fixture';

describe('Auth User (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
    // 테스트용 사용자 생성 (로그인 가능한 상태로)
    await createTestUser(
      app,
      userFixtures.existing.email,
      userFixtures.existing.password,
      userFixtures.existing.name,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/login', () => {
    it('사용자 로그인 성공', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: userFixtures.existing.email,
          password: userFixtures.existing.password,
        });

      if (response.status !== 200) {
        console.log('로그인 실패 응답:', {
          status: response.status,
          body: response.body,
          email: userFixtures.existing.email,
        });
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(typeof response.body.accessToken).toBe('string');
    });

    it('잘못된 이메일로 로그인 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(userFixtures.invalid.wrongEmail)
        .expect(404);
    });

    it('잘못된 비밀번호로 로그인 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(userFixtures.invalid.wrongPassword)
        .expect(401);
    });

    it('필수 필드 누락 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: userFixtures.existing.email })
        .expect(400);
    });
  });
});

