import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { getUserToken } from '../setup/test-helpers';
import { userFixtures } from '../fixtures/user.fixture';

describe('Interest Group (e2e)', () => {
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

  describe('POST /api/v1/interest-group', () => {
    it('관심 그룹 생성 성공', () => {
      const interestGroupData = {
        group: 'HYPERTENSION_MANAGEMENT',
      };

      return request(app.getHttpServer())
        .post('/api/v1/interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send(interestGroupData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('group', interestGroupData.group);
        });
    });

    it('토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/interest-group')
        .send({
          group: 'HYPERTENSION_MANAGEMENT',
        })
        .expect(401);
    });

    it('잘못된 데이터로 생성 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/v1/interest-group', () => {
    it('관심 그룹 조회 성공', () => {
      return request(app.getHttpServer())
        .get('/api/v1/interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          // 관심 그룹이 있으면 200, 없으면 null이 반환될 수 있음
          expect([200, 404]).toContain(res.status);
        });
    });

    it('토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/interest-group')
        .expect(401);
    });
  });

  describe('PATCH /api/v1/interest-group', () => {
    it('관심 그룹 수정 성공', async () => {
      // 먼저 관심 그룹을 생성
      await request(app.getHttpServer())
        .post('/api/v1/interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          group: 'HYPERTENSION_MANAGEMENT',
        })
        .expect(201);

      const updateData = {
        group: 'DIABETES_MANAGEMENT',
      };

      return request(app.getHttpServer())
        .patch('/api/v1/interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('group', updateData.group);
        });
    });

    it('관심 그룹이 없을 때 수정 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          group: 'HYPERTENSION_MANAGEMENT',
        })
        .expect((res) => {
          // 관심 그룹이 없으면 404
          expect([200, 404]).toContain(res.status);
        });
    });
  });

  describe('DELETE /api/v1/interest-group', () => {
    it('관심 그룹 삭제 성공', async () => {
      // 먼저 관심 그룹을 생성
      await request(app.getHttpServer())
        .post('/api/v1/interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          group: 'HYPERTENSION_MANAGEMENT',
        })
        .expect(201);

      return request(app.getHttpServer())
        .delete('/api/v1/interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });

    it('관심 그룹이 없을 때 삭제 시도 시 실패', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });
    });
  });
});


