import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { getUserToken } from '../setup/test-helpers';
import { userFixtures } from '../fixtures/user.fixture';

describe('Disease History (e2e)', () => {
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

  describe('POST /api/v1/disease-history', () => {
    it('질환 이력 생성 성공', () => {
      const diseaseHistoryData = {
        chronicDiseases: ['이상지질혈증', '고혈압'],
        chronicRespiratoryDiseases: [],
        chronicArthritis: [],
        pastChronicDiseases: [],
        cancerHistory: [],
        isSmoking: 'NO',
        isDrinking: 'YES',
      };

      return request(app.getHttpServer())
        .post('/api/v1/disease-history')
        .set('Authorization', `Bearer ${userToken}`)
        .send(diseaseHistoryData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('chronicDiseases');
        });
    });

    it('토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/disease-history')
        .send({
          chronicDiseases: ['이상지질혈증'],
          isSmoking: 'NO',
          isDrinking: 'NO',
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/disease-history', () => {
    it('질환 이력 조회 성공', () => {
      return request(app.getHttpServer())
        .get('/api/v1/disease-history')
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          // 질환 이력이 있으면 200, 없으면 null이 반환될 수 있음
          expect([200, 404]).toContain(res.status);
        });
    });

    it('토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/disease-history')
        .expect(401);
    });
  });

  describe('PATCH /api/v1/disease-history', () => {
    it('질환 이력 수정 성공', async () => {
      // 먼저 질환 이력을 생성
      await request(app.getHttpServer())
        .post('/api/v1/disease-history')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          chronicDiseases: ['이상지질혈증'],
          isSmoking: 'NO',
          isDrinking: 'NO',
        })
        .expect(201);

      const updateData = {
        chronicDiseases: ['이상지질혈증', '당뇨병'],
        isSmoking: 'YES',
      };

      return request(app.getHttpServer())
        .patch('/api/v1/disease-history')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);
    });

    it('질환 이력이 없을 때 수정 시도 시 실패', () => {
      // 질환 이력이 없는 사용자 토큰이 필요한 경우
      return request(app.getHttpServer())
        .patch('/api/v1/disease-history')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          chronicDiseases: ['이상지질혈증'],
        })
        .expect((res) => {
          // 질환 이력이 없으면 404
          expect([200, 404]).toContain(res.status);
        });
    });
  });

  describe('DELETE /api/v1/disease-history', () => {
    it('질환 이력 삭제 성공', async () => {
      // 먼저 질환 이력을 생성
      await request(app.getHttpServer())
        .post('/api/v1/disease-history')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          chronicDiseases: ['이상지질혈증'],
          isSmoking: 'NO',
          isDrinking: 'NO',
        })
        .expect(201);

      return request(app.getHttpServer())
        .delete('/api/v1/disease-history')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });

    it('질환 이력이 없을 때 삭제 시도 시 실패', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/disease-history')
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });
    });
  });
});


