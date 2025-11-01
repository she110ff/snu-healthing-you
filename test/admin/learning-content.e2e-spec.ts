import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import { getAdminToken, getUserToken } from '../setup/test-helpers';
import { userFixtures } from '../fixtures/user.fixture';
import { commonFixtures } from '../fixtures/common.fixture';
import { ContentItemType } from '@prisma/client';

describe('Learning Content Admin (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let createdGroupId: string;
  let createdTopicId: string;
  let createdContentId: string;
  let createdStepId: string;

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
    // 생성된 테스트 데이터 정리 (역순으로 삭제)
    if (createdStepId) {
      await request(app.getHttpServer())
        .delete(`/api/v1/admin/learning-content/steps/${createdStepId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    }
    if (createdContentId) {
      await request(app.getHttpServer())
        .delete(`/api/v1/admin/learning-content/contents/${createdContentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    }
    if (createdTopicId) {
      await request(app.getHttpServer())
        .delete(`/api/v1/admin/learning-content/topics/${createdTopicId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    }
    if (createdGroupId) {
      await request(app.getHttpServer())
        .delete(`/api/v1/admin/learning-content/groups/${createdGroupId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    }
    await app.close();
  });

  // ============================================
  // LearningContentGroup Tests
  // ============================================

  describe('POST /api/v1/admin/learning-content/groups', () => {
    it('[관리자] 학습 컨텐츠 그룹 생성 성공', async () => {
      const createData = {
        name: `테스트 그룹_${Date.now()}`,
        description: '테스트 설명',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/learning-content/groups')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createData.name);
      expect(response.body.description).toBe(createData.description);
      createdGroupId = response.body.id;
    });

    it('관리자 토큰 없이 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/learning-content/groups')
        .send({ name: '테스트 그룹' })
        .expect(401);
    });

    it('일반 사용자 토큰으로 접근 시도 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/learning-content/groups')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: '테스트 그룹' })
        .expect(403);
    });
  });

  describe('GET /api/v1/admin/learning-content/groups', () => {
    it('[관리자] 학습 컨텐츠 그룹 목록 조회 성공', () => {
      return request(app.getHttpServer())
        .get('/api/v1/admin/learning-content/groups')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('GET /api/v1/admin/learning-content/groups/:id', () => {
    it('[관리자] 학습 컨텐츠 그룹 조회 성공', async () => {
      if (!createdGroupId) {
        // 그룹이 없다면 생성
        const createResponse = await request(app.getHttpServer())
          .post('/api/v1/admin/learning-content/groups')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: `테스트 그룹_${Date.now()}` })
          .expect(201);
        createdGroupId = createResponse.body.id;
      }

      return request(app.getHttpServer())
        .get(`/api/v1/admin/learning-content/groups/${createdGroupId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
        });
    });

    it('존재하지 않는 ID로 조회 시 실패', () => {
      return request(app.getHttpServer())
        .get(
          `/api/v1/admin/learning-content/groups/${commonFixtures.uuids.nonExistent}`,
        )
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/v1/admin/learning-content/groups/:id', () => {
    it('[관리자] 학습 컨텐츠 그룹 수정 성공', async () => {
      if (!createdGroupId) {
        const createResponse = await request(app.getHttpServer())
          .post('/api/v1/admin/learning-content/groups')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: `테스트 그룹_${Date.now()}` })
          .expect(201);
        createdGroupId = createResponse.body.id;
      }

      const updateData = {
        name: `수정된 그룹_${Date.now()}`,
        description: '수정된 설명',
      };

      return request(app.getHttpServer())
        .patch(`/api/v1/admin/learning-content/groups/${createdGroupId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateData.name);
          expect(res.body.description).toBe(updateData.description);
        });
    });
  });

  // ============================================
  // Topic Tests
  // ============================================

  describe('POST /api/v1/admin/learning-content/topics', () => {
    it('[관리자] 주제 생성 성공', async () => {
      if (!createdGroupId) {
        const createResponse = await request(app.getHttpServer())
          .post('/api/v1/admin/learning-content/groups')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: `테스트 그룹_${Date.now()}` })
          .expect(201);
        createdGroupId = createResponse.body.id;
      }

      const createData = {
        learningContentGroupId: createdGroupId,
        title: `테스트 주제_${Date.now()}`,
        description: '테스트 주제 설명',
        order: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/learning-content/topics')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createData.title);
      createdTopicId = response.body.id;
    });

    it('존재하지 않는 그룹 ID로 주제 생성 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/admin/learning-content/topics')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          learningContentGroupId: commonFixtures.uuids.nonExistent,
          title: '테스트 주제',
          order: 1,
        })
        .expect(404);
    });
  });

  describe('GET /api/v1/admin/learning-content/groups/:groupId/topics', () => {
    it('[관리자] 그룹별 주제 목록 조회 성공', async () => {
      if (!createdGroupId) {
        const createResponse = await request(app.getHttpServer())
          .post('/api/v1/admin/learning-content/groups')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ name: `테스트 그룹_${Date.now()}` })
          .expect(201);
        createdGroupId = createResponse.body.id;
      }

      return request(app.getHttpServer())
        .get(`/api/v1/admin/learning-content/groups/${createdGroupId}/topics`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  // ============================================
  // Content Tests
  // ============================================

  describe('POST /api/v1/admin/learning-content/contents', () => {
    it('[관리자] 컨텐츠 생성 성공', async () => {
      if (!createdTopicId) {
        if (!createdGroupId) {
          const groupResponse = await request(app.getHttpServer())
            .post('/api/v1/admin/learning-content/groups')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: `테스트 그룹_${Date.now()}` })
            .expect(201);
          createdGroupId = groupResponse.body.id;
        }

        const topicResponse = await request(app.getHttpServer())
          .post('/api/v1/admin/learning-content/topics')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            learningContentGroupId: createdGroupId,
            title: `테스트 주제_${Date.now()}`,
            order: 1,
          })
          .expect(201);
        createdTopicId = topicResponse.body.id;
      }

      const createData = {
        topicId: createdTopicId,
        title: `테스트 컨텐츠_${Date.now()}`,
        order: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/learning-content/contents')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createData.title);
      createdContentId = response.body.id;
    });
  });

  describe('GET /api/v1/admin/learning-content/topics/:topicId/contents', () => {
    it('[관리자] 주제별 컨텐츠 목록 조회 성공', async () => {
      if (!createdTopicId) {
        if (!createdGroupId) {
          const groupResponse = await request(app.getHttpServer())
            .post('/api/v1/admin/learning-content/groups')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: `테스트 그룹_${Date.now()}` })
            .expect(201);
          createdGroupId = groupResponse.body.id;
        }

        const topicResponse = await request(app.getHttpServer())
          .post('/api/v1/admin/learning-content/topics')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            learningContentGroupId: createdGroupId,
            title: `테스트 주제_${Date.now()}`,
            order: 1,
          })
          .expect(201);
        createdTopicId = topicResponse.body.id;
      }

      return request(app.getHttpServer())
        .get(`/api/v1/admin/learning-content/topics/${createdTopicId}/contents`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  // ============================================
  // Step Tests
  // ============================================

  describe('POST /api/v1/admin/learning-content/steps', () => {
    it('[관리자] 스텝 생성 성공', async () => {
      if (!createdContentId) {
        if (!createdTopicId) {
          if (!createdGroupId) {
            const groupResponse = await request(app.getHttpServer())
              .post('/api/v1/admin/learning-content/groups')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({ name: `테스트 그룹_${Date.now()}` })
              .expect(201);
            createdGroupId = groupResponse.body.id;
          }

          const topicResponse = await request(app.getHttpServer())
            .post('/api/v1/admin/learning-content/topics')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              learningContentGroupId: createdGroupId,
              title: `테스트 주제_${Date.now()}`,
              order: 1,
            })
            .expect(201);
          createdTopicId = topicResponse.body.id;
        }

        const contentResponse = await request(app.getHttpServer())
          .post('/api/v1/admin/learning-content/contents')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            topicId: createdTopicId,
            title: `테스트 컨텐츠_${Date.now()}`,
            order: 1,
          })
          .expect(201);
        createdContentId = contentResponse.body.id;
      }

      const createData = {
        contentId: createdContentId,
        pageTitle: `테스트 페이지_${Date.now()}`,
        order: 1,
        contentItems: [
          {
            type: ContentItemType.TEXT,
            order: 1,
            data: { text: '테스트 텍스트' },
          },
          {
            type: ContentItemType.IMAGE,
            order: 2,
            data: { imageUrl: 'https://example.com/image.jpg' },
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/learning-content/steps')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(createData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.pageTitle).toBe(createData.pageTitle);
      expect(response.body.contentItems).toHaveLength(2);
      createdStepId = response.body.id;
    });
  });

  describe('GET /api/v1/admin/learning-content/contents/:contentId/steps', () => {
    it('[관리자] 컨텐츠별 스텝 목록 조회 성공', async () => {
      if (!createdContentId) {
        if (!createdTopicId) {
          if (!createdGroupId) {
            const groupResponse = await request(app.getHttpServer())
              .post('/api/v1/admin/learning-content/groups')
              .set('Authorization', `Bearer ${adminToken}`)
              .send({ name: `테스트 그룹_${Date.now()}` })
              .expect(201);
            createdGroupId = groupResponse.body.id;
          }

          const topicResponse = await request(app.getHttpServer())
            .post('/api/v1/admin/learning-content/topics')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              learningContentGroupId: createdGroupId,
              title: `테스트 주제_${Date.now()}`,
              order: 1,
            })
            .expect(201);
          createdTopicId = topicResponse.body.id;
        }

        const contentResponse = await request(app.getHttpServer())
          .post('/api/v1/admin/learning-content/contents')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            topicId: createdTopicId,
            title: `테스트 컨텐츠_${Date.now()}`,
            order: 1,
          })
          .expect(201);
        createdContentId = contentResponse.body.id;
      }

      return request(app.getHttpServer())
        .get(
          `/api/v1/admin/learning-content/contents/${createdContentId}/steps`,
        )
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});

