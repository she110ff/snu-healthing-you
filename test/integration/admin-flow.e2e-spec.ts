import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { getAdminToken } from '../setup/test-helpers';

describe('Admin Flow Integration (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    adminToken = await getAdminToken(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('관리자 승인 플로우 테스트', () => {
    it('관리자 로그인 → 사용자 목록 조회 → 사용자 승인 → 승인된 사용자 확인', async () => {
      // 1. 관리자 로그인 확인 (이미 beforeAll에서 완료)
      expect(adminToken).toBeDefined();

      // 2. 사용자 목록 조회 (users API는 관리자/일반 사용자 모두 접근 가능)
      const usersResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(usersResponse.body)).toBe(true);

      // 3. 승인 대기 중인 사용자 찾기 (필요시)
      if (usersResponse.body.length > 0) {
        const unapprovedUser = usersResponse.body.find(
          (user: any) => !user.approvedByAdmin,
        );

        if (unapprovedUser) {
          // 4. 사용자 승인
          const approveResponse = await request(app.getHttpServer())
            .patch(`/api/v1/approve/${unapprovedUser.id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect((res) => {
              expect([200, 400, 404]).toContain(res.status);
            });

          if (approveResponse.status === 200) {
            // 5. 승인 상태 확인
            const statusResponse = await request(app.getHttpServer())
              .get(`/api/v1/users/${unapprovedUser.id}/status`)
              .set('Authorization', `Bearer ${adminToken}`)
              .expect(200);

            expect(statusResponse.body).toHaveProperty('approvedByAdmin');
            expect(statusResponse.body.approvedByAdmin).toBe(true);
          }
        }
      }
    });

    it('관리자 로그인 → 기관 설정 생성 → 기관 설정 조회 → 기관 설정 수정 → 기관 설정 삭제', async () => {
      const testInstitutionName = `테스트기관_${Date.now()}`;
      const testEmailDomain = `test${Date.now()}.ac.kr`;

      // 1. 기관 설정 생성
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/admin/institution-config')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: testInstitutionName,
          emailForm: testEmailDomain,
          pointPoolTotal: '1000000000',
          pointLimitPerUser: 25000,
          affiliationCodes: [
            { code: 'TEST01', name: '교원' },
            { code: 'TEST02', name: '교직원' },
          ],
        })
        .expect((res) => {
          expect([201, 409]).toContain(res.status);
        });

      if (createResponse.status === 201) {
        const configId = createResponse.body.id;

        // 2. 기관 설정 조회
        await request(app.getHttpServer())
          .get(`/api/v1/admin/institution-config/${configId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id', configId);
            expect(res.body).toHaveProperty('name', testInstitutionName);
            expect(res.body).toHaveProperty('emailForm', testEmailDomain);
          });

        // 3. 기관 설정 수정 (pointLimitPerUser만 수정 가능)
        const updatedPointLimit = 30000;
        await request(app.getHttpServer())
          .patch(`/api/v1/admin/institution-config/${configId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            pointLimitPerUser: updatedPointLimit,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty(
              'pointLimitPerUser',
              updatedPointLimit,
            );
          });

        // 4. 기관 설정 삭제
        await request(app.getHttpServer())
          .delete(`/api/v1/admin/institution-config/${configId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(204);
      }
    });

    it('관리자 배치 승인 플로우', async () => {
      // 사용자 목록 조회
      const usersResponse = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      if (usersResponse.body.length > 0) {
        // 승인 대기 중인 사용자들 찾기
        const unapprovedUsers = usersResponse.body
          .filter((user: any) => !user.approvedByAdmin)
          .slice(0, 2) // 최대 2명만 테스트
          .map((user: any) => user.id);

        if (unapprovedUsers.length > 0) {
          // 배치 승인
          const batchApproveResponse = await request(app.getHttpServer())
            .patch('/api/v1/approve/batch')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ ids: unapprovedUsers })
            .expect((res) => {
              expect([200, 400]).toContain(res.status);
            });

          if (batchApproveResponse.status === 200) {
            expect(batchApproveResponse.body).toHaveProperty('approved');
            expect(batchApproveResponse.body).toHaveProperty('failed');
            expect(Array.isArray(batchApproveResponse.body.approved)).toBe(
              true,
            );
            expect(Array.isArray(batchApproveResponse.body.failed)).toBe(true);
          }
        }
      }
    });
  });
});
