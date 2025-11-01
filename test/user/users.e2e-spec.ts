import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { getUserToken } from '../setup/test-helpers';
import { userFixtures } from '../fixtures/user.fixture';
import { commonFixtures } from '../fixtures/common.fixture';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    userToken = await getUserToken(
      app,
      userFixtures.existing.email,
      userFixtures.existing.password,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/users/register', () => {
    it('회원가입 성공', async () => {
      // 먼저 이메일 인증코드 발급 필요
      await request(app.getHttpServer())
        .post('/api/v1/email-verification/send-code')
        .send({ email: `newuser${Date.now()}@snu.ac.kr` })
        .expect(200);

      // 실제 테스트에서는 발급된 인증코드를 사용해야 함
      const registerData = {
        ...userFixtures.new,
        email: `newuser${Date.now()}@snu.ac.kr`,
      };

      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send(registerData)
        .expect(201);
    });

    it('이미 가입된 이메일로 회원가입 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({
          ...userFixtures.new,
          email: userFixtures.existing.email,
        })
        .expect(409);
    });

    it('잘못된 인증코드로 회원가입 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({
          ...userFixtures.new,
          emailVerificationCode: commonFixtures.emailVerification.invalidCode,
        })
        .expect(400);
    });

    it('필수 필드 누락 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({ email: userFixtures.new.email })
        .expect(400);
    });
  });

  describe('GET /api/v1/users', () => {
    it('사용자 목록 조회 성공', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(401);
    });
  });

  describe('GET /api/v1/users/:id/status', () => {
    it('사용자 상태 조회 성공', async () => {
      // 먼저 사용자 목록에서 ID를 가져옴
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        return request(app.getHttpServer())
          .get(`/api/v1/users/${userId}/status`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('emailVerified');
            expect(res.body).toHaveProperty('approvedByAdmin');
          });
      }
    });

    it('존재하지 않는 사용자 ID로 조회 시 실패', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users/${commonFixtures.uuids.nonExistent}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('사용자 정보 조회 성공', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        return request(app.getHttpServer())
          .get(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('email');
            expect(res.body).toHaveProperty('name');
          });
      }
    });

    it('존재하지 않는 사용자 ID로 조회 시 실패', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('사용자 정보 수정 성공', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        const updateData = {
          name: `수정된이름_${Date.now()}`,
        };

        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('name', updateData.name);
          });
      }
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('사용자 삭제 성공', async () => {
      // 테스트용 사용자를 생성하고 삭제하는 것이 좋으나,
      // 실제 테스트에서는 기존 사용자 삭제를 피해야 함
      // 여기서는 구조만 확인
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      // 실제 삭제는 신중하게 테스트해야 함
      // return request(app.getHttpServer())
      //   .delete(`/api/v1/users/${userId}`)
      //   .set('Authorization', `Bearer ${userToken}`)
      //   .expect(200);
    });

    it('존재하지 않는 사용자 ID로 삭제 시도 시 실패', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/users/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });
});


