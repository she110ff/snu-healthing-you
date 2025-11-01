import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { commonFixtures } from '../fixtures/common.fixture';

describe('Organization Verification (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/organization-verification/verify-code', () => {
    it('유효한 조직 코드 검증 성공 (SNU01)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/organization-verification/verify-code')
        .send({ organizationCode: commonFixtures.organizationCodes.valid[0] })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('verified', true);
          expect(res.body).toHaveProperty('message');
        });
    });

    it('유효한 조직 코드 검증 성공 (SNU02)', () => {
      return request(app.getHttpServer())
        .post('/api/v1/organization-verification/verify-code')
        .send({ organizationCode: commonFixtures.organizationCodes.valid[1] })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('verified', true);
        });
    });

    it('잘못된 조직 코드로 검증 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/organization-verification/verify-code')
        .send({ organizationCode: commonFixtures.organizationCodes.invalid[0] })
        .expect(400);
    });

    it('빈 문자열로 검증 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/organization-verification/verify-code')
        .send({ organizationCode: '' })
        .expect(400);
    });

    it('필수 필드 누락 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/organization-verification/verify-code')
        .send({})
        .expect(400);
    });
  });
});


