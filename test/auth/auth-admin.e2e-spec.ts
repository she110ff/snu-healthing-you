import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { adminFixtures } from '../fixtures/admin.fixture';

describe('Auth Admin (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/admin/login', () => {
    it('관리자 로그인 성공', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send(adminFixtures.valid)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(typeof res.body.accessToken).toBe('string');
        });
    });

    it('잘못된 관리자 이름으로 로그인 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send(adminFixtures.invalid.wrongName)
        .expect(404);
    });

    it('잘못된 비밀번호로 로그인 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send(adminFixtures.invalid.wrongPassword)
        .expect(401);
    });

    it('필수 필드 누락 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/admin/login')
        .send({ name: '관리자' })
        .expect(400);
    });
  });
});


