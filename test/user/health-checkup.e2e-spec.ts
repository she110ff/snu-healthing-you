import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { getUserToken } from '../setup/test-helpers';
import { userFixtures } from '../fixtures/user.fixture';
import { commonFixtures } from '../fixtures/common.fixture';

describe('Health Checkup (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let createdCheckupId: string;

  beforeAll(async () => {
    app = await createTestApp();
    userToken = await getUserToken(
      app,
      userFixtures.existing.email,
      userFixtures.existing.password,
    );
  });

  afterAll(async () => {
    // 생성된 테스트 데이터 정리
    if (createdCheckupId) {
      await request(app.getHttpServer())
        .delete(`/api/v1/health-checkup/${createdCheckupId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    }
    await app.close();
  });

  describe('POST /api/v1/health-checkup', () => {
    it('건강검진 기록 생성 성공', async () => {
      const checkupData = {
        checkupDate: '2024-01-15',
        bmi: 22.5,
        waistCircumference: 75.0,
        systolicBloodPressure: 120,
        diastolicBloodPressure: 80,
        totalCholesterol: 200,
        hdlCholesterol: 60,
        ldlCholesterol: 120,
        triglycerides: 150,
        hemoglobin: 14.0,
        ast: 25,
        alt: 20,
        serumCreatinine: 0.9,
        glomerularFiltrationRate: 95.0,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/health-checkup')
        .set('Authorization', `Bearer ${userToken}`)
        .send(checkupData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId');
      createdCheckupId = response.body.id;
    });

    it('토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/health-checkup')
        .send({
          checkupDate: '2024-01-15',
          bmi: 22.5,
        })
        .expect(401);
    });

    it('잘못된 데이터로 생성 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/health-checkup')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/v1/health-checkup', () => {
    it('건강검진 기록 목록 조회 성공', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health-checkup')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health-checkup')
        .expect(401);
    });
  });

  describe('GET /api/v1/health-checkup/:id', () => {
    it('건강검진 기록 조회 성공', async () => {
      if (!createdCheckupId) {
        // 먼저 기록을 생성
        const createResponse = await request(app.getHttpServer())
          .post('/api/v1/health-checkup')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            checkupDate: '2024-01-15',
            bmi: 22.5,
          })
          .expect(201);

        createdCheckupId = createResponse.body.id;
      }

      return request(app.getHttpServer())
        .get(`/api/v1/health-checkup/${createdCheckupId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', createdCheckupId);
        });
    });

    it('존재하지 않는 기록 ID로 조회 시 실패', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/health-checkup/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/v1/health-checkup/:id', () => {
    it('건강검진 기록 수정 성공', async () => {
      if (!createdCheckupId) {
        const createResponse = await request(app.getHttpServer())
          .post('/api/v1/health-checkup')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            checkupDate: '2024-01-15',
            bmi: 22.5,
          })
          .expect(201);

        createdCheckupId = createResponse.body.id;
      }

      const updateData = {
        bmi: 23.0,
      };

      return request(app.getHttpServer())
        .patch(`/api/v1/health-checkup/${createdCheckupId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);
    });

    it('존재하지 않는 기록 ID로 수정 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch(`/api/v1/health-checkup/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ bmi: 23.0 })
        .expect(404);
    });
  });

  describe('DELETE /api/v1/health-checkup/:id', () => {
    it('건강검진 기록 삭제 성공', async () => {
      // 임시로 기록을 생성하여 삭제 테스트
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/health-checkup')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          checkupDate: '2024-01-20',
          bmi: 22.0,
        })
        .expect(201);

      const tempCheckupId = createResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/api/v1/health-checkup/${tempCheckupId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });

    it('존재하지 않는 기록 ID로 삭제 시도 시 실패', () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/health-checkup/${commonFixtures.uuids.nonExistent}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });
});


