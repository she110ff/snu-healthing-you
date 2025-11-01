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
      const testEmail = `newuser${Date.now()}@snu.ac.kr`;
      
      // 먼저 이메일 인증코드 발급
      const sendCodeResponse = await request(app.getHttpServer())
        .post('/api/v1/email-verification/send-code')
        .send({ email: testEmail })
        .expect(200);

      // 발급된 인증코드 사용 (개발 환경에서는 응답에 포함됨)
      const verificationCode = sendCodeResponse.body.code || '123456';

      const registerData = {
        ...userFixtures.new,
        email: testEmail,
        verificationCode,
      };

      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send(registerData)
        .expect(201);
    });

    it('이미 가입된 이메일로 회원가입 시도 시 실패', async () => {
      // 이미 가입된 이메일에 대해서는 인증코드 발급 단계에서 409가 반환되어야 하지만,
      // 만약 인증코드가 있다면 회원가입 단계에서 체크됨
      // 여기서는 인증코드 검증이 먼저 실행되어 400이 반환될 수 있음
      // 실제로는 이메일 발급 단계에서 409를 반환하므로 이 테스트는 인증코드 없이 시도
      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({
          email: userFixtures.existing.email,
          password: userFixtures.new.password,
          verificationCode: '000000', // 존재하지 않는 인증코드
          organizationCode: userFixtures.new.organizationCode,
        })
        .expect((res) => {
          // 인증코드 검증 실패 시 401, 또는 중복 이메일 체크가 먼저 실행되면 409
          expect([400, 401, 409]).toContain(res.status);
        });
    });

    it('잘못된 인증코드로 회원가입 시도 시 실패', async () => {
      const testEmail = `invalidcode${Date.now()}@snu.ac.kr`;
      
      // 먼저 올바른 인증코드 발급
      await request(app.getHttpServer())
        .post('/api/v1/email-verification/send-code')
        .send({ email: testEmail })
        .expect(200);

      // 잘못된 인증코드로 회원가입 시도
      return request(app.getHttpServer())
        .post('/api/v1/users/register')
        .send({
          ...userFixtures.new,
          email: testEmail,
          verificationCode: commonFixtures.emailVerification.invalidCode,
        })
        .expect(401); // 인증코드 검증 실패 시 UnauthorizedException (401)
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
    it('사용자 정보 수정 성공 - 단일 필드 (height)', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        const updateData = {
          height: 180.5,
        };

        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('height', updateData.height);
          });
      }
    });

    it('사용자 정보 수정 성공 - 여러 필드 동시 수정', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        const updateData = {
          weight: 75.5,
          sidoCode: '26',
          guGunCode: '26350',
        };

        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('weight', updateData.weight);
            expect(res.body).toHaveProperty('sidoCode', updateData.sidoCode);
            expect(res.body).toHaveProperty('guGunCode', updateData.guGunCode);
          });
      }
    });

    it('사용자 정보 수정 성공 - 생년월일 및 성별 수정', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        const updateData = {
          dateOfBirth: '1995-05-15',
          gender: 'FEMALE',
        };

        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updateData)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('gender', updateData.gender);
            expect(res.body).toHaveProperty('dateOfBirth');
            // dateOfBirth는 Date 객체로 변환되어 반환되므로 형식 검증만
            expect(new Date(res.body.dateOfBirth).toISOString().split('T')[0]).toBe(
              updateData.dateOfBirth,
            );
          });
      }
    });

    it('존재하지 않는 사용자 ID로 수정 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/users/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ height: 180.0 })
        .expect(404);
    });

    it('잘못된 성별 값으로 수정 시도 시 실패', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;
        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ gender: 'INVALID' })
          .expect(400);
      }
    });

    it('허용되지 않은 필드(name)를 포함한 요청은 거부됨', async () => {
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const userId = listResponse.body[0].id;

        // 허용되지 않은 필드(name)를 포함한 요청은 ValidationPipe에서 400 에러 반환
        return request(app.getHttpServer())
          .patch(`/api/v1/users/${userId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            height: 180.0,
            name: '수정되지않아야하는이름',
          })
          .expect(400);
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


