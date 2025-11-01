import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { getAdminToken, getUserToken, createUnapprovedTestUser } from '../setup/test-helpers';
import { userFixtures } from '../fixtures/user.fixture';
import { commonFixtures } from '../fixtures/common.fixture';

describe('Approve (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;

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
    await app.close();
  });

  describe('PATCH /api/v1/approve/:id', () => {
    it('[관리자] 사용자 승인 성공', async () => {
      // 테스트용 미승인 사용자 생성
      const unapprovedUser = await createUnapprovedTestUser(app);
      const userId = unapprovedUser.id;

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/approve/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      if (response.status !== 200) {
        console.error('승인 실패:', response.status, response.body);
      }
      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('approvedByAdmin', true);
    });

    it('관리자 토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/approve/${commonFixtures.uuids.valid}`)
        .expect(401);
    });

    it('일반 사용자 토큰으로 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/approve/${commonFixtures.uuids.valid}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('존재하지 않는 사용자 ID로 승인 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/approve/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('잘못된 UUID 형식으로 승인 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/approve/${commonFixtures.uuids.invalid}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
    });
  });

  describe('PATCH /api/v1/approve/batch', () => {
    it('[관리자] 복수 사용자 배치 승인 성공', async () => {
      // 테스트용 미승인 사용자 2명 생성
      const user1 = await createUnapprovedTestUser(app);
      const user2 = await createUnapprovedTestUser(app);
      const userIds = [user1.id, user2.id];

      const response = await request(app.getHttpServer())
        .patch('/api/v1/approve/batch')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ids: userIds })
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('failed');
      expect(Array.isArray(response.body.success)).toBe(true);
      expect(Array.isArray(response.body.failed)).toBe(true);
    });

    it('빈 배열로 배치 승인 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/approve/batch')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ids: [] })
        .expect(400);
    });

    it('잘못된 UUID 형식 포함 시 실패', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/approve/batch')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ids: [commonFixtures.uuids.invalid] })
        .expect(400);
    });

    it('관리자 토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/approve/batch')
        .send({ ids: [commonFixtures.uuids.valid] })
        .expect(401);
    });

    it('일반 사용자 토큰으로 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/approve/batch')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ ids: [commonFixtures.uuids.valid] })
        .expect(403);
    });
  });
});

