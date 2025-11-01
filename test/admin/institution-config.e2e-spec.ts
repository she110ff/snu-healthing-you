import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { getAdminToken, getUserToken } from '../setup/test-helpers';
import { userFixtures } from '../fixtures/user.fixture';
import { commonFixtures } from '../fixtures/common.fixture';

describe('Institution Config Admin (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let createdConfigId: string;

  beforeAll(async () => {
    app = await createTestApp();
    adminToken = await getAdminToken(app);
    userToken = await getUserToken(
      app,
      userFixtures.existing.email,
      userFixtures.existing.password,
    );
  });

  afterAll(async () => {
    // 생성된 테스트 데이터 정리
    if (createdConfigId) {
      await request(app.getHttpServer())
        .delete(`/api/v1/admin/institution-config/${createdConfigId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    }
    await app.close();
  });

  describe('GET /api/v1/admin/institution-config', () => {
    it('[관리자] 기관 설정 목록 조회 성공', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/institution-config')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('관리자 토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/institution-config')
        .expect(401);
    });

    it('일반 사용자 토큰으로 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/institution-config')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('GET /api/v1/admin/institution-config/:id', () => {
    it('[관리자] 기관 설정 조회 성공', async () => {
      // 먼저 목록을 조회하여 존재하는 ID 사용
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/admin/institution-config')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      if (listResponse.body.length > 0) {
        const configId = listResponse.body[0].id;
        return request(app.getHttpServer())
          .get(`/api/v1/admin/institution-config/${configId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('institutionName');
          });
      }
    });

    it('존재하지 않는 ID로 조회 시 실패', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/admin/institution-config/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('POST /api/v1/admin/institution-config', () => {
    it('[관리자] 기관 설정 생성 성공', async () => {
      const createData = {
        institutionName: `테스트기관_${Date.now()}`,
        emailDomain: `test${Date.now()}.ac.kr`,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/institution-config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('institutionName', createData.institutionName);
      createdConfigId = response.body.id;
    });

    it('중복된 기관명으로 생성 시도 시 실패', async () => {
      // 이미 존재하는 기관명 사용
      const createData = {
        institutionName: '서울대학교',
        emailDomain: 'duplicate.ac.kr',
      };

      return request(app.getHttpServer())
        .post('/api/v1/admin/institution-config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createData)
        .expect(409);
    });

    it('잘못된 데이터로 생성 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/institution-config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);
    });

    it('일반 사용자 토큰으로 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/institution-config')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          institutionName: '테스트기관',
          emailDomain: 'test.ac.kr',
        })
        .expect(403);
    });
  });

  describe('PATCH /api/v1/admin/institution-config/:id', () => {
    it('[관리자] 기관 설정 수정 성공', async () => {
      if (!createdConfigId) {
        // 테스트용 설정이 없으면 스킵
        return;
      }

      const updateData = {
        institutionName: `수정된기관_${Date.now()}`,
      };

      return request(app.getHttpServer())
        .patch(`/api/v1/admin/institution-config/${createdConfigId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('institutionName', updateData.institutionName);
        });
    });

    it('존재하지 않는 ID로 수정 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/admin/institution-config/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ institutionName: '수정된기관' })
        .expect(404);
    });
  });

  describe('DELETE /api/v1/admin/institution-config/:id', () => {
    it('[관리자] 기관 설정 삭제 성공', async () => {
      // 임시로 설정을 생성하여 삭제 테스트
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/admin/institution-config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          institutionName: `삭제테스트기관_${Date.now()}`,
          emailDomain: `deletetest${Date.now()}.ac.kr`,
        })
        .expect(201);

      const tempConfigId = createResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/api/v1/admin/institution-config/${tempConfigId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('존재하지 않는 ID로 삭제 시도 시 실패', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/admin/institution-config/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('일반 사용자 토큰으로 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/admin/institution-config/${commonFixtures.uuids.valid}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});


