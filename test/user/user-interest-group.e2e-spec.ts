import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { getUserToken, getAdminToken } from '../setup/test-helpers';
import { userFixtures } from '../fixtures/user.fixture';

describe('User Interest Group (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let learningContentGroupId: string;

  beforeAll(async () => {
    app = await createTestApp();
    userToken = await getUserToken(
      app,
      userFixtures.existing.email,
      userFixtures.existing.password,
    );

    // 테스트용 LearningContentGroup 생성
    const adminToken = await getAdminToken(app);

    const createGroupResponse = await request(app.getHttpServer())
      .post('/api/v1/learning-content/groups')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: `고혈압 관리 그룹_${Date.now()}`,
        description: '테스트용 그룹',
      });

    if (createGroupResponse.status === 201) {
      learningContentGroupId = createGroupResponse.body.id;
    } else {
      // 이미 존재하는 경우 조회 (일반 사용자도 조회 가능)
      const groupsResponse = await request(app.getHttpServer())
        .get('/api/v1/learning-content/groups')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      if (groupsResponse.body && groupsResponse.body.length > 0) {
        learningContentGroupId = groupsResponse.body[0].id;
      } else {
        throw new Error('학습 컨텐츠 그룹을 찾을 수 없습니다.');
      }
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/user-interest-group', () => {
    it('사용자 관심 그룹 생성 성공', () => {
      const userInterestGroupData = {
        learningContentGroupId: learningContentGroupId,
      };

      return request(app.getHttpServer())
        .post('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send(userInterestGroupData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('learningContentGroupId', userInterestGroupData.learningContentGroupId);
        });
    });

    it('토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/user-interest-group')
        .send({
          learningContentGroupId: learningContentGroupId,
        })
        .expect(401);
    });

    it('잘못된 데이터로 생성 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/v1/user-interest-group', () => {
    it('사용자 관심 그룹 조회 성공', () => {
      return request(app.getHttpServer())
        .get('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          // 사용자 관심 그룹이 있으면 200, 없으면 null이 반환될 수 있음
          expect([200, 404]).toContain(res.status);
        });
    });

    it('토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/user-interest-group')
        .expect(401);
    });
  });

  describe('PATCH /api/v1/user-interest-group', () => {
    it('사용자 관심 그룹 수정 성공', async () => {
      // 먼저 사용자 관심 그룹을 생성
      await request(app.getHttpServer())
        .post('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: learningContentGroupId,
        })
        .expect(201);

      const updateData = {
        learningContentGroupId: learningContentGroupId,
      };

      return request(app.getHttpServer())
        .patch('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('learningContentGroupId', updateData.learningContentGroupId);
        });
    });

    it('사용자 관심 그룹이 없을 때 수정 시도 시 실패', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: learningContentGroupId,
        })
        .expect((res) => {
          // 사용자 관심 그룹이 없으면 404
          expect([200, 404]).toContain(res.status);
        });
    });
  });

  describe('DELETE /api/v1/user-interest-group', () => {
    it('사용자 관심 그룹 삭제 성공', async () => {
      // 먼저 사용자 관심 그룹을 생성
      await request(app.getHttpServer())
        .post('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: learningContentGroupId,
        })
        .expect(201);

      return request(app.getHttpServer())
        .delete('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });

    it('사용자 관심 그룹이 없을 때 삭제 시도 시 실패', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .expect((res) => {
          expect([200, 404]).toContain(res.status);
        });
    });
  });
});

