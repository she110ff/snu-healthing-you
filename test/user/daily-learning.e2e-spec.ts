import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from '../setup/test-setup';
import {
  getAdminToken,
  getUserToken,
  createTestUser,
} from '../setup/test-helpers';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ContentItemType } from '@prisma/client';

describe('Daily Learning (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let testUserId: string;
  let testGroupId: string;
  let testTopicId: string;
  let testContentId: string;
  let testStepId1: string;
  let testStepId2: string;
  let testGroupId2: string;

  beforeAll(async () => {
    app = await createTestApp();
    adminToken = await getAdminToken(app);

    // 테스트용 사용자 생성
    const testEmail = `dailylearning${Date.now()}@snu.ac.kr`;
    const testUser = await createTestUser(app, testEmail, 'password');
    testUserId = testUser.id;
    userToken = await getUserToken(app, testEmail, 'password');

    // 테스트용 학습 컨텐츠 생성
    const prisma = app.get(PrismaService);

    // 그룹 1 생성
    const group1 = await prisma.learningContentGroup.create({
      data: {
        name: '테스트 학습 그룹 1',
        description: '일일 학습 테스트용 그룹',
      },
    });
    testGroupId = group1.id;

    // Topic 생성
    const topic = await prisma.topic.create({
      data: {
        learningContentGroupId: testGroupId,
        title: '테스트 주제',
        description: '테스트용 주제',
        order: 1,
      },
    });
    testTopicId = topic.id;

    // Content 생성
    const content = await prisma.content.create({
      data: {
        topicId: testTopicId,
        title: '테스트 컨텐츠',
        order: 1,
      },
    });
    testContentId = content.id;

    // Step 1 생성
    const step1 = await prisma.step.create({
      data: {
        contentId: testContentId,
        pageTitle: 'Step 1',
        order: 1,
      },
    });
    testStepId1 = step1.id;

    // Step 1의 ContentItem 생성
    await prisma.stepContentItem.create({
      data: {
        stepId: testStepId1,
        type: ContentItemType.TEXT,
        order: 1,
        data: { text: '첫 번째 스텝입니다.' },
      },
    });

    // Step 2 생성
    const step2 = await prisma.step.create({
      data: {
        contentId: testContentId,
        pageTitle: 'Step 2',
        order: 2,
      },
    });
    testStepId2 = step2.id;

    // Step 2의 ContentItem 생성
    await prisma.stepContentItem.create({
      data: {
        stepId: testStepId2,
        type: ContentItemType.TEXT,
        order: 1,
        data: { text: '두 번째 스텝입니다.' },
      },
    });

    // 그룹 2 생성 (그룹 변경 테스트용)
    const group2 = await prisma.learningContentGroup.create({
      data: {
        name: '테스트 학습 그룹 2',
        description: '그룹 변경 테스트용',
      },
    });
    testGroupId2 = group2.id;

    // 그룹 2의 Topic 생성
    const topic2 = await prisma.topic.create({
      data: {
        learningContentGroupId: testGroupId2,
        title: '그룹 2 주제',
        order: 1,
      },
    });

    // 그룹 2의 Content 생성
    const content2 = await prisma.content.create({
      data: {
        topicId: topic2.id,
        title: '그룹 2 컨텐츠',
        order: 1,
      },
    });

    // 그룹 2의 Step 생성
    const stepGroup2 = await prisma.step.create({
      data: {
        contentId: content2.id,
        pageTitle: '그룹 2 Step 1',
        order: 1,
      },
    });

    await prisma.stepContentItem.create({
      data: {
        stepId: stepGroup2.id,
        type: ContentItemType.TEXT,
        order: 1,
        data: { text: '그룹 2 첫 번째 스텝' },
      },
    });
  });

  afterAll(async () => {
    const prisma = app.get(PrismaService);

    // 테스트 데이터 정리
    if (testUserId) {
      // 일일 세션 삭제 (먼저 삭제 - 외래키 제약 조건)
      try {
        await prisma.dailyLearningSession.deleteMany({
          where: { userId: testUserId },
        });
      } catch (e) {
        // 테이블이 없을 수 있음
      }
      // 사용자 진행 상태 삭제
      try {
        await prisma.userLearningProgress.deleteMany({
          where: { userId: testUserId },
        });
      } catch (e) {
        // 테이블이 없을 수 있음
      }
      // 사용자 관심 그룹 삭제
      await prisma.userInterestGroup.deleteMany({
        where: { userId: testUserId },
      });
    }

    // 학습 컨텐츠 삭제 (역순)
    if (testStepId1) {
      await prisma.stepContentItem.deleteMany({
        where: { stepId: testStepId1 },
      });
      await prisma.step.delete({ where: { id: testStepId1 } });
    }
    if (testStepId2) {
      await prisma.stepContentItem.deleteMany({
        where: { stepId: testStepId2 },
      });
      await prisma.step.delete({ where: { id: testStepId2 } });
    }
    if (testContentId) {
      await prisma.content.delete({ where: { id: testContentId } });
    }
    if (testTopicId) {
      await prisma.topic.delete({ where: { id: testTopicId } });
    }
    if (testGroupId) {
      await prisma.learningContentGroup.delete({ where: { id: testGroupId } });
    }

    // 그룹 2 삭제
    if (testGroupId2) {
      const group2Steps = await prisma.step.findMany({
        where: {
          content: {
            topic: {
              learningContentGroupId: testGroupId2,
            },
          },
        },
      });
      for (const step of group2Steps) {
        await prisma.stepContentItem.deleteMany({
          where: { stepId: step.id },
        });
        await prisma.step.delete({ where: { id: step.id } });
      }
      const group2Contents = await prisma.content.findMany({
        where: {
          topic: {
            learningContentGroupId: testGroupId2,
          },
        },
      });
      for (const content of group2Contents) {
        await prisma.content.delete({ where: { id: content.id } });
      }
      const group2Topics = await prisma.topic.findMany({
        where: { learningContentGroupId: testGroupId2 },
      });
      for (const topic of group2Topics) {
        await prisma.topic.delete({ where: { id: topic.id } });
      }
      await prisma.learningContentGroup.delete({ where: { id: testGroupId2 } });
    }

    await app.close();
  });

  describe('POST /api/v1/daily-learning/select-group', () => {
    it('그룹 선택 성공', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: testGroupId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', testUserId);
      expect(response.body).toHaveProperty(
        'learningContentGroupId',
        testGroupId,
      );
      expect(response.body).toHaveProperty('currentStepId');
      expect(response.body).toHaveProperty('isCompleted', false);
    });

    it('인증 없이 접근 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .send({
          learningContentGroupId: testGroupId,
        })
        .expect(401);
    });

    it('존재하지 않는 그룹 선택 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(404);
    });

    it('잘못된 UUID 형식 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: 'invalid-uuid',
        })
        .expect(400);
    });
  });

  describe('GET /api/v1/daily-learning/current', () => {
    it('현재 학습 컨텐츠 조회 성공', async () => {
      // 먼저 그룹 선택
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: testGroupId,
        });

      // UserInterestGroup도 설정
      await request(app.getHttpServer())
        .post('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: testGroupId,
        });

      const response = await request(app.getHttpServer())
        .get('/api/v1/daily-learning/current')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('progress');
      expect(response.body).toHaveProperty('currentSession');
      expect(response.body).toHaveProperty('progressPercentage');
      expect(response.body.progress).toHaveProperty('currentStepId');
      expect(response.body.currentStep).toBeDefined();
    });

    it('특정 그룹 ID로 조회 성공', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/daily-learning/current?groupId=${testGroupId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('progress');
      expect(response.body.progress).toHaveProperty(
        'learningContentGroupId',
        testGroupId,
      );
    });

    it('인증 없이 접근 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/daily-learning/current')
        .expect(401);
    });
  });

  describe('POST /api/v1/daily-learning/complete-step', () => {
    it('Step 완료 성공', async () => {
      // 먼저 그룹 선택
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: testGroupId,
        });

      // Step 완료
      const response = await request(app.getHttpServer())
        .post('/api/v1/daily-learning/complete-step')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          stepId: testStepId1,
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('currentStepId');
      // 다음 Step으로 이동했는지 확인
      expect(response.body.currentStepId).toBe(testStepId2);
    });

    it('순서대로 하지 않은 Step 완료 시 실패', async () => {
      // 새로운 사용자 생성하여 격리된 테스트
      const isolatedEmail = `isolated${Date.now()}@snu.ac.kr`;
      const isolatedUser = await createTestUser(app, isolatedEmail, 'password');
      const isolatedToken = await getUserToken(app, isolatedEmail, 'password');

      // 그룹 선택
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${isolatedToken}`)
        .send({
          learningContentGroupId: testGroupId,
        });

      // Step 2를 먼저 완료하려고 시도 (Step 1이 아직 완료되지 않은 상태)
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/complete-step')
        .set('Authorization', `Bearer ${isolatedToken}`)
        .send({
          stepId: testStepId2,
        })
        .expect(400);
    });

    it('존재하지 않는 Step 완료 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/daily-learning/complete-step')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          stepId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(404);
    });

    it('인증 없이 접근 시 실패', () => {
      return request(app.getHttpServer())
        .post('/api/v1/daily-learning/complete-step')
        .send({
          stepId: testStepId1,
        })
        .expect(401);
    });
  });

  describe('GET /api/v1/daily-learning/progress/:groupId', () => {
    it('특정 그룹의 진행 상태 조회 성공', async () => {
      // 먼저 그룹 선택
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: testGroupId,
        });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/daily-learning/progress/${testGroupId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty(
        'learningContentGroupId',
        testGroupId,
      );
      expect(response.body).toHaveProperty('userId', testUserId);
    });

    it('인증 없이 접근 시 실패', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/daily-learning/progress/${testGroupId}`)
        .expect(401);
    });
  });

  describe('GET /api/v1/daily-learning/progress', () => {
    it('모든 그룹의 진행 상태 조회 성공', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/daily-learning/progress')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('인증 없이 접근 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/daily-learning/progress')
        .expect(401);
    });
  });

  describe('GET /api/v1/daily-learning/summary', () => {
    it('오늘의 학습 요약 조회 성공', async () => {
      // 먼저 사용자 관심 그룹 설정
      await request(app.getHttpServer())
        .post('/api/v1/user-interest-group')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          learningContentGroupId: testGroupId,
        });

      const response = await request(app.getHttpServer())
        .get('/api/v1/daily-learning/summary')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('selectedGroup');
      expect(response.body).toHaveProperty('currentProgress');
      expect(response.body).toHaveProperty('todaySession');
      expect(response.body).toHaveProperty('totalTopics');
      expect(response.body).toHaveProperty('totalContents');
      expect(response.body).toHaveProperty('totalSteps');
      expect(response.body).toHaveProperty('overallProgressPercentage');
      expect(response.body).toHaveProperty('todayProgressPercentage');
    });

    it('관심 그룹이 없을 때 실패', () => {
      // 새로운 사용자 생성 (관심 그룹 없음)
      return createTestUser(
        app,
        `newuser${Date.now()}@snu.ac.kr`,
        'password',
      ).then(async (newUser) => {
        const newUserToken = await getUserToken(app, newUser.email, 'password');

        return request(app.getHttpServer())
          .get('/api/v1/daily-learning/summary')
          .set('Authorization', `Bearer ${newUserToken}`)
          .expect(404);
      });
    });

    it('인증 없이 접근 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/daily-learning/summary')
        .expect(401);
    });
  });

  describe('GET /api/v1/daily-learning/session/:groupId', () => {
    it('오늘의 학습 세션 조회 성공', async () => {
      // 새로운 사용자 생성하여 격리된 테스트
      const isolatedEmail = `session${Date.now()}@snu.ac.kr`;
      const isolatedUser = await createTestUser(app, isolatedEmail, 'password');
      const isolatedToken = await getUserToken(app, isolatedEmail, 'password');

      // 먼저 그룹 선택
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${isolatedToken}`)
        .send({
          learningContentGroupId: testGroupId,
        });

      const response = await request(app.getHttpServer())
        .get(`/api/v1/daily-learning/session/${testGroupId}`)
        .set('Authorization', `Bearer ${isolatedToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('stepsCompleted', 0);
      expect(response.body).toHaveProperty('sessionDate');
    });

    it('인증 없이 접근 시 실패', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/daily-learning/session/${testGroupId}`)
        .expect(401);
    });
  });

  describe('GET /api/v1/daily-learning/sessions', () => {
    it('모든 그룹의 오늘 세션 조회 성공', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/daily-learning/sessions')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('인증 없이 접근 시 실패', () => {
      return request(app.getHttpServer())
        .get('/api/v1/daily-learning/sessions')
        .expect(401);
    });
  });

  describe('그룹 변경 시 이전 진행 상태 유지', () => {
    it('그룹 변경 후 이전 그룹의 진행 상태가 유지됨', async () => {
      // 새로운 사용자 생성하여 격리된 테스트
      const isolatedEmail = `groupchange${Date.now()}@snu.ac.kr`;
      const isolatedUser = await createTestUser(app, isolatedEmail, 'password');
      const isolatedToken = await getUserToken(app, isolatedEmail, 'password');

      // 그룹 1 선택 및 Step 완료
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${isolatedToken}`)
        .send({
          learningContentGroupId: testGroupId,
        });

      // Step 1 완료
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/complete-step')
        .set('Authorization', `Bearer ${isolatedToken}`)
        .send({
          stepId: testStepId1,
        });

      // 그룹 1의 진행 상태 확인
      const progress1Before = await request(app.getHttpServer())
        .get(`/api/v1/daily-learning/progress/${testGroupId}`)
        .set('Authorization', `Bearer ${isolatedToken}`);

      expect(progress1Before.body.currentStepId).toBe(testStepId2);

      // 그룹 2로 변경
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${isolatedToken}`)
        .send({
          learningContentGroupId: testGroupId2,
        });

      // 그룹 1의 진행 상태가 여전히 유지되는지 확인
      const progress1After = await request(app.getHttpServer())
        .get(`/api/v1/daily-learning/progress/${testGroupId}`)
        .set('Authorization', `Bearer ${isolatedToken}`);

      expect(progress1After.body.currentStepId).toBe(testStepId2);
      expect(progress1After.body.learningContentGroupId).toBe(testGroupId);

      // 다시 그룹 1 선택 시 이전 진행 상태로 복원되는지 확인
      const currentLearning = await request(app.getHttpServer())
        .get(`/api/v1/daily-learning/current?groupId=${testGroupId}`)
        .set('Authorization', `Bearer ${isolatedToken}`);

      expect(currentLearning.body.progress.currentStepId).toBe(testStepId2);
    });
  });

  describe('일일 학습 세션 통계', () => {
    it('Step 완료 시 오늘의 세션 통계가 업데이트됨', async () => {
      // 새로운 사용자 생성하여 격리된 테스트
      const isolatedEmail = `sessionstats${Date.now()}@snu.ac.kr`;
      const isolatedUser = await createTestUser(app, isolatedEmail, 'password');
      const isolatedToken = await getUserToken(app, isolatedEmail, 'password');

      // 그룹 선택
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/select-group')
        .set('Authorization', `Bearer ${isolatedToken}`)
        .send({
          learningContentGroupId: testGroupId,
        });

      // 초기 세션 조회
      const sessionBefore = await request(app.getHttpServer())
        .get(`/api/v1/daily-learning/session/${testGroupId}`)
        .set('Authorization', `Bearer ${isolatedToken}`);

      const initialStepsCompleted = sessionBefore.body.stepsCompleted;

      // Step 완료
      await request(app.getHttpServer())
        .post('/api/v1/daily-learning/complete-step')
        .set('Authorization', `Bearer ${isolatedToken}`)
        .send({
          stepId: testStepId1,
        });

      // 세션 조회
      const sessionAfter = await request(app.getHttpServer())
        .get(`/api/v1/daily-learning/session/${testGroupId}`)
        .set('Authorization', `Bearer ${isolatedToken}`);

      expect(sessionAfter.body.stepsCompleted).toBe(initialStepsCompleted + 1);
    });
  });
});
