import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserInterestGroupService } from '../user-interest-group/user-interest-group.service';
import { LearningContentService } from '../learning-content/learning-content.service';
import { SelectGroupDto } from './dto/select-group.dto';
import { CompleteStepDto } from './dto/complete-step.dto';
import { LearningProgressResponseDto } from './dto/learning-progress-response.dto';
import { DailyLearningSessionResponseDto } from './dto/daily-learning-session-response.dto';
import { CurrentLearningContentResponseDto } from './dto/current-learning-content-response.dto';
import { DailyLearningSummaryResponseDto } from './dto/daily-learning-summary-response.dto';
import { TopicResponseDto } from '../learning-content/dto/topic-response.dto';
import { ContentResponseDto } from '../learning-content/dto/content-response.dto';
import { StepResponseDto } from '../learning-content/dto/step-response.dto';
import { LearningContentGroupResponseDto } from '../learning-content/dto/learning-content-group-response.dto';

@Injectable()
export class DailyLearningService {
  constructor(
    private prisma: PrismaService,
    private userInterestGroupService: UserInterestGroupService,
    private learningContentService: LearningContentService,
  ) {}

  /**
   * 날짜만 추출 (시간 제거)
   */
  private getTodayDateOnly(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  /**
   * 그룹 선택 또는 진행 상태 조회
   */
  async selectGroup(
    userId: string,
    groupId: string,
  ): Promise<LearningProgressResponseDto> {
    // 그룹 존재 여부 확인
    const group = await this.prisma.learningContentGroup.findFirst({
      where: {
        id: groupId,
        deletedAt: null,
      },
    });

    if (!group) {
      throw new NotFoundException(
        `학습 컨텐츠 그룹을 찾을 수 없습니다. (ID: ${groupId})`,
      );
    }

    // 진행 상태 조회 또는 생성
    let progress = await this.prisma.userLearningProgress.findUnique({
      where: {
        userId_learningContentGroupId: {
          userId,
          learningContentGroupId: groupId,
        },
      },
    });

    if (!progress) {
      // 첫 번째 Topic/Content/Step 찾기
      const firstTopic = await this.findFirstTopic(groupId);
      if (!firstTopic) {
        throw new BadRequestException(
          '이 그룹에는 학습할 컨텐츠가 없습니다.',
        );
      }

      const firstContent = await this.findFirstContent(firstTopic.id);
      if (!firstContent) {
        throw new BadRequestException(
          '이 그룹에는 학습할 컨텐츠가 없습니다.',
        );
      }

      const firstStep = await this.findFirstStep(firstContent.id);
      if (!firstStep) {
        throw new BadRequestException(
          '이 그룹에는 학습할 컨텐츠가 없습니다.',
        );
      }

      // 진행 상태 생성
      progress = await this.prisma.userLearningProgress.create({
        data: {
          userId,
          learningContentGroupId: groupId,
          currentTopicId: firstTopic.id,
          currentContentId: firstContent.id,
          currentStepId: firstStep.id,
        },
      });

      // 오늘의 세션 생성
      await this.getOrCreateTodaySession(userId, groupId, progress.id);
    } else {
      // 오늘의 세션 조회 또는 생성
      await this.getOrCreateTodaySession(userId, groupId, progress.id);
    }

    return this.mapToProgressResponse(progress);
  }

  /**
   * 현재 학습 중인 컨텐츠 조회
   */
  async getCurrentLearningContent(
    userId: string,
    groupId?: string,
  ): Promise<CurrentLearningContentResponseDto> {
    // groupId가 없으면 UserInterestGroup에서 선택된 그룹 사용
    let targetGroupId = groupId;
    if (!targetGroupId) {
      const userInterestGroup =
        await this.userInterestGroupService.findOne(userId);
      if (!userInterestGroup) {
        throw new NotFoundException(
          '선택된 학습 그룹이 없습니다. 그룹을 먼저 선택해주세요.',
        );
      }
      targetGroupId = userInterestGroup.learningContentGroupId;
    }

    // 진행 상태 조회 또는 생성
    let progress = await this.prisma.userLearningProgress.findUnique({
      where: {
        userId_learningContentGroupId: {
          userId,
          learningContentGroupId: targetGroupId,
        },
      },
      include: {
        currentTopic: true,
        currentContent: true,
        currentStep: {
          include: {
            contentItems: {
              where: { deletedAt: null },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!progress) {
      // 진행 상태가 없으면 생성
      const newProgress = await this.prisma.userLearningProgress.create({
        data: {
          userId,
          learningContentGroupId: targetGroupId,
        },
      });
      // 첫 번째 Step으로 초기화
      await this.initializeProgress(newProgress.id, targetGroupId);
      // 관계를 포함하여 다시 조회
      progress = await this.prisma.userLearningProgress.findUnique({
        where: {
          userId_learningContentGroupId: {
            userId,
            learningContentGroupId: targetGroupId,
          },
        },
        include: {
          currentTopic: true,
          currentContent: true,
          currentStep: {
            include: {
              contentItems: {
                where: { deletedAt: null },
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });
    }

    // progress가 null이 아님을 보장
    if (!progress) {
      throw new NotFoundException('학습 진행 상태를 생성할 수 없습니다.');
    }

    // 오늘의 세션 조회 또는 생성
    const todaySession = await this.getOrCreateTodaySession(
      userId,
      targetGroupId,
      progress.id,
    );

    // 현재 Topic/Content/Step 정보
    let currentTopic: TopicResponseDto | null = null;
    let currentContent: ContentResponseDto | null = null;
    let currentStep: StepResponseDto | null = null;

    if (progress.currentTopicId) {
      const topicData = await this.prisma.topic.findUnique({
        where: { id: progress.currentTopicId },
      });
      if (topicData) {
        currentTopic = this.mapToTopicResponse(topicData);
      }
    }

    if (progress.currentContentId) {
      const contentData = await this.prisma.content.findUnique({
        where: { id: progress.currentContentId },
      });
      if (contentData) {
        currentContent = this.mapToContentResponse(contentData);
      }
    }

    if (progress.currentStepId) {
      const stepData = await this.prisma.step.findUnique({
        where: { id: progress.currentStepId },
        include: {
          contentItems: {
            where: { deletedAt: null },
            orderBy: { order: 'asc' },
          },
        },
      });
      if (stepData) {
        currentStep = this.mapToStepResponse(stepData, stepData.contentItems);
      }
    }

    // 다음 Step 찾기
    const nextStep = await this.findNextStep(
      progress.currentStepId,
      progress.currentContentId,
      progress.currentTopicId,
      targetGroupId,
    );

    // 진행률 계산
    const progressPercentage = await this.calculateProgressPercentage(
      targetGroupId,
      progress,
    );

    const todayProgressPercentage = await this.calculateTodayProgressPercentage(
      targetGroupId,
      todaySession,
    );

    return {
      progress: this.mapToProgressResponse(progress),
      currentSession: this.mapToSessionResponse(todaySession),
      currentTopic,
      currentContent,
      currentStep,
      nextStep: nextStep
        ? this.mapToStepResponse(nextStep, nextStep.contentItems)
        : null,
      progressPercentage,
      todayProgressPercentage,
    };
  }

  /**
   * Step 완료 처리
   */
  async completeStep(
    userId: string,
    stepId: string,
  ): Promise<LearningProgressResponseDto> {
    // Step 정보 조회
    const step = await this.prisma.step.findFirst({
      where: {
        id: stepId,
        deletedAt: null,
      },
      include: {
        content: {
          include: {
            topic: true,
          },
        },
      },
    });

    if (!step) {
      throw new NotFoundException(`Step을 찾을 수 없습니다. (ID: ${stepId})`);
    }

    const groupId = step.content.topic.learningContentGroupId;

    // 진행 상태 조회
    const progress = await this.prisma.userLearningProgress.findUnique({
      where: {
        userId_learningContentGroupId: {
          userId,
          learningContentGroupId: groupId,
        },
      },
    });

    if (!progress) {
      throw new NotFoundException('학습 진행 상태를 찾을 수 없습니다.');
    }

    // 진행 순서 검증
    if (progress.currentStepId !== stepId) {
      throw new BadRequestException(
        '현재 진행 중인 Step이 아닙니다. 순서대로 학습해주세요.',
      );
    }

    // 오늘의 세션 조회 또는 생성
    const todaySession = await this.getOrCreateTodaySession(
      userId,
      groupId,
      progress.id,
    );

    // 트랜잭션으로 진행 상태와 세션 업데이트
    const result = await this.prisma.$transaction(async (tx) => {
      // 다음 Step 찾기 (같은 Content 내)
      const nextStep = await this.findNextStepInTransaction(
        tx,
        stepId,
        step.contentId,
        step.content.topicId,
        groupId,
      );

      let updateData: any = {};
      let sessionUpdateData: any = {
        stepsCompleted: { increment: 1 },
        lastLearningAt: new Date(),
      };

      if (nextStep) {
        // 같은 Content 내 다음 Step으로 이동
        updateData.currentStepId = nextStep.id;
        updateData.currentContentId = step.contentId;
        updateData.currentTopicId = step.content.topicId;
      } else {
        // 현재 Content의 모든 Step이 완료됨
        // 다음 Content 찾기
        const nextContent = await this.findNextContentInTransaction(
          tx,
          step.contentId,
          step.content.topicId,
          groupId,
        );

        if (nextContent) {
          // 다음 Content의 첫 번째 Step으로 이동
          const firstStepOfNextContent = await this.findFirstStepInTransaction(
            tx,
            nextContent.id,
          );
          if (firstStepOfNextContent) {
            updateData.currentStepId = firstStepOfNextContent.id;
            updateData.currentContentId = nextContent.id;
            updateData.currentTopicId = nextContent.topicId;
            sessionUpdateData.contentsCompleted = { increment: 1 };
          } else {
            // 다음 Content에 Step이 없으면 다음 Content로 계속 진행
            const nextNextContent = await this.findNextContentInTransaction(
              tx,
              nextContent.id,
              nextContent.topicId,
              groupId,
            );
            if (nextNextContent) {
              const firstStep = await this.findFirstStepInTransaction(
                tx,
                nextNextContent.id,
              );
              if (firstStep) {
                updateData.currentStepId = firstStep.id;
                updateData.currentContentId = nextNextContent.id;
                updateData.currentTopicId = nextNextContent.topicId;
                sessionUpdateData.contentsCompleted = { increment: 1 };
              }
            } else {
              // 다음 Content가 없으면 다음 Topic 찾기
              const nextTopic = await this.findNextTopicInTransaction(
                tx,
                step.content.topicId,
                groupId,
              );

              if (nextTopic) {
                const firstContentOfNextTopic =
                  await this.findFirstContentInTransaction(tx, nextTopic.id);
                if (firstContentOfNextTopic) {
                  const firstStepOfNextContent =
                    await this.findFirstStepInTransaction(
                      tx,
                      firstContentOfNextTopic.id,
                    );
                  if (firstStepOfNextContent) {
                    updateData.currentStepId = firstStepOfNextContent.id;
                    updateData.currentContentId = firstContentOfNextTopic.id;
                    updateData.currentTopicId = nextTopic.id;
                    sessionUpdateData.topicsCompleted = { increment: 1 };
                  }
                }
              } else {
                // 모든 학습 완료
                updateData.isCompleted = true;
                updateData.completedAt = new Date();
                updateData.currentStepId = null;
                updateData.currentContentId = null;
                updateData.currentTopicId = null;
              }
            }
          }
        } else {
          // 다음 Content가 없으면 다음 Topic 찾기
          const nextTopic = await this.findNextTopicInTransaction(
            tx,
            step.content.topicId,
            groupId,
          );

          if (nextTopic) {
            const firstContentOfNextTopic =
              await this.findFirstContentInTransaction(tx, nextTopic.id);
            if (firstContentOfNextTopic) {
              const firstStepOfNextContent =
                await this.findFirstStepInTransaction(
                  tx,
                  firstContentOfNextTopic.id,
                );
              if (firstStepOfNextContent) {
                updateData.currentStepId = firstStepOfNextContent.id;
                updateData.currentContentId = firstContentOfNextTopic.id;
                updateData.currentTopicId = nextTopic.id;
                sessionUpdateData.topicsCompleted = { increment: 1 };
              }
            }
          } else {
            // 모든 학습 완료
            updateData.isCompleted = true;
            updateData.completedAt = new Date();
            updateData.currentStepId = null;
            updateData.currentContentId = null;
            updateData.currentTopicId = null;
          }
        }
      }

      // 진행 상태 업데이트
      const updatedProgress = await tx.userLearningProgress.update({
        where: { id: progress.id },
        data: updateData,
      });

      // 세션 업데이트
      await tx.dailyLearningSession.update({
        where: { id: todaySession.id },
        data: sessionUpdateData,
      });

      return updatedProgress;
    });

    return this.mapToProgressResponse(result);
  }

  /**
   * 진행 상태 조회
   */
  async getProgress(
    userId: string,
    groupId: string,
  ): Promise<LearningProgressResponseDto> {
    const progress = await this.prisma.userLearningProgress.findUnique({
      where: {
        userId_learningContentGroupId: {
          userId,
          learningContentGroupId: groupId,
        },
      },
    });

    if (!progress) {
      throw new NotFoundException('학습 진행 상태를 찾을 수 없습니다.');
    }

    return this.mapToProgressResponse(progress);
  }

  /**
   * 사용자의 모든 그룹 진행 상태 조회
   */
  async getAllProgress(
    userId: string,
  ): Promise<LearningProgressResponseDto[]> {
    const progressList = await this.prisma.userLearningProgress.findMany({
      where: { userId },
    });

    return progressList.map((p) => this.mapToProgressResponse(p));
  }

  /**
   * 오늘의 학습 요약 조회
   */
  async getDailyLearningSummary(
    userId: string,
  ): Promise<DailyLearningSummaryResponseDto> {
    // 선택된 그룹 조회
    const userInterestGroup =
      await this.userInterestGroupService.findOne(userId);
    if (!userInterestGroup) {
      throw new NotFoundException(
        '선택된 학습 그룹이 없습니다. 그룹을 먼저 선택해주세요.',
      );
    }

    const groupId = userInterestGroup.learningContentGroupId;

    // 그룹 정보 조회
    const group = await this.learningContentService.findOneLearningContentGroup(
      groupId,
    );

    // 진행 상태 조회 또는 생성
    let progress = await this.prisma.userLearningProgress.findUnique({
      where: {
        userId_learningContentGroupId: {
          userId,
          learningContentGroupId: groupId,
        },
      },
    });

    if (!progress) {
      const newProgress = await this.prisma.userLearningProgress.create({
        data: {
          userId,
          learningContentGroupId: groupId,
        },
      });
      progress = await this.initializeProgress(newProgress.id, groupId);
    }

    // progress가 null이 아님을 보장
    if (!progress) {
      throw new NotFoundException('학습 진행 상태를 생성할 수 없습니다.');
    }

    // 오늘의 세션 조회 또는 생성
    const todaySession = await this.getOrCreateTodaySession(
      userId,
      groupId,
      progress.id,
    );

    // 전체 통계 계산
    const totalTopics = await this.prisma.topic.count({
      where: {
        learningContentGroupId: groupId,
        deletedAt: null,
      },
    });

    const totalContents = await this.prisma.content.count({
      where: {
        topic: {
          learningContentGroupId: groupId,
          deletedAt: null,
        },
        deletedAt: null,
      },
    });

    const totalSteps = await this.prisma.step.count({
      where: {
        content: {
          topic: {
            learningContentGroupId: groupId,
            deletedAt: null,
          },
          deletedAt: null,
        },
        deletedAt: null,
      },
    });

    // 완료 통계 (현재는 단순히 진행 위치 기준, 실제로는 완료 기록 필요)
    const topicsCompleted = progress.isCompleted
      ? totalTopics
      : progress.currentTopicId
        ? await this.countCompletedTopics(groupId, progress.currentTopicId)
        : 0;

    const contentsCompleted = progress.isCompleted
      ? totalContents
      : progress.currentContentId
        ? await this.countCompletedContents(
            groupId,
            progress.currentTopicId!,
            progress.currentContentId,
          )
        : 0;

    const stepsCompleted = progress.isCompleted
      ? totalSteps
      : progress.currentStepId
        ? await this.countCompletedSteps(
            groupId,
            progress.currentContentId!,
            progress.currentStepId,
          )
        : 0;

    // 진행률 계산
    const overallProgressPercentage =
      totalSteps > 0 ? (stepsCompleted / totalSteps) * 100 : 0;
    const todayProgressPercentage =
      totalSteps > 0 ? (todaySession.stepsCompleted / totalSteps) * 100 : 0;

    return {
      selectedGroup: group,
      currentProgress: this.mapToProgressResponse(progress),
      todaySession: this.mapToSessionResponse(todaySession),
      totalTopics,
      totalContents,
      totalSteps,
      topicsCompleted,
      contentsCompleted,
      stepsCompleted,
      todayTopicsCompleted: todaySession.topicsCompleted,
      todayContentsCompleted: todaySession.contentsCompleted,
      todayStepsCompleted: todaySession.stepsCompleted,
      overallProgressPercentage,
      todayProgressPercentage,
    };
  }

  /**
   * 오늘의 학습 세션 조회
   */
  async getTodaySession(
    userId: string,
    groupId: string,
  ): Promise<DailyLearningSessionResponseDto> {
    const progress = await this.prisma.userLearningProgress.findUnique({
      where: {
        userId_learningContentGroupId: {
          userId,
          learningContentGroupId: groupId,
        },
      },
    });

    if (!progress) {
      throw new NotFoundException('학습 진행 상태를 찾을 수 없습니다.');
    }

    const session = await this.getOrCreateTodaySession(
      userId,
      groupId,
      progress.id,
    );

    return this.mapToSessionResponse(session);
  }

  /**
   * 모든 그룹의 오늘 세션 조회
   */
  async getAllTodaySessions(
    userId: string,
  ): Promise<DailyLearningSessionResponseDto[]> {
    const today = this.getTodayDateOnly();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sessions = await this.prisma.dailyLearningSession.findMany({
      where: {
        userId,
        sessionDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return sessions.map((s) => this.mapToSessionResponse(s));
  }

  // ============================================
  // Private Helper Methods
  // ============================================

  /**
   * 오늘의 세션 조회 또는 생성
   */
  private async getOrCreateTodaySession(
    userId: string,
    groupId: string,
    userProgressId: string,
  ) {
    const today = this.getTodayDateOnly();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let session = await this.prisma.dailyLearningSession.findFirst({
      where: {
        userId,
        learningContentGroupId: groupId,
        sessionDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (!session) {
      session = await this.prisma.dailyLearningSession.create({
        data: {
          userId,
          learningContentGroupId: groupId,
          userProgressId,
          sessionDate: today,
          topicsCompleted: 0,
          contentsCompleted: 0,
          stepsCompleted: 0,
          lastLearningAt: new Date(),
        },
      });
    }

    return session;
  }

  /**
   * 진행 상태 초기화 (첫 번째 Step으로 설정)
   */
  private async initializeProgress(
    progressId: string,
    groupId: string,
  ): Promise<NonNullable<Awaited<ReturnType<typeof this.prisma.userLearningProgress.findUnique>>>> {
    const firstTopic = await this.findFirstTopic(groupId);
    if (!firstTopic) {
      const progress = await this.prisma.userLearningProgress.findUnique({
        where: { id: progressId },
      });
      if (!progress) {
        throw new NotFoundException('학습 진행 상태를 찾을 수 없습니다.');
      }
      return progress;
    }

    const firstContent = await this.findFirstContent(firstTopic.id);
    if (!firstContent) {
      const progress = await this.prisma.userLearningProgress.findUnique({
        where: { id: progressId },
      });
      if (!progress) {
        throw new NotFoundException('학습 진행 상태를 찾을 수 없습니다.');
      }
      return progress;
    }

    const firstStep = await this.findFirstStep(firstContent.id);
    if (!firstStep) {
      const progress = await this.prisma.userLearningProgress.findUnique({
        where: { id: progressId },
      });
      if (!progress) {
        throw new NotFoundException('학습 진행 상태를 찾을 수 없습니다.');
      }
      return progress;
    }

    const updated = await this.prisma.userLearningProgress.update({
      where: { id: progressId },
      data: {
        currentTopicId: firstTopic.id,
        currentContentId: firstContent.id,
        currentStepId: firstStep.id,
      },
    });

    return updated;
  }

  /**
   * 첫 번째 Topic 찾기
   */
  private async findFirstTopic(groupId: string) {
    return await this.prisma.topic.findFirst({
      where: {
        learningContentGroupId: groupId,
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 첫 번째 Content 찾기
   */
  private async findFirstContent(topicId: string) {
    return await this.prisma.content.findFirst({
      where: {
        topicId,
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 첫 번째 Step 찾기
   */
  private async findFirstStep(contentId: string) {
    return await this.prisma.step.findFirst({
      where: {
        contentId,
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 트랜잭션 내 첫 번째 Topic 찾기
   */
  private async findFirstTopicInTransaction(tx: any, groupId: string) {
    return await tx.topic.findFirst({
      where: {
        learningContentGroupId: groupId,
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 트랜잭션 내 첫 번째 Content 찾기
   */
  private async findFirstContentInTransaction(tx: any, topicId: string) {
    return await tx.content.findFirst({
      where: {
        topicId,
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 트랜잭션 내 첫 번째 Step 찾기
   */
  private async findFirstStepInTransaction(tx: any, contentId: string) {
    return await tx.step.findFirst({
      where: {
        contentId,
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 다음 Step 찾기
   */
  private async findNextStep(
    currentStepId: string | null,
    currentContentId: string | null,
    currentTopicId: string | null,
    groupId: string,
  ) {
    if (!currentStepId || !currentContentId) {
      return null;
    }

    const currentStep = await this.prisma.step.findUnique({
      where: { id: currentStepId },
      include: {
        contentItems: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!currentStep) {
      return null;
    }

    // 같은 Content 내 다음 Step 찾기
    const nextStep = await this.prisma.step.findFirst({
      where: {
        contentId: currentContentId,
        order: { gt: currentStep.order },
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
      include: {
        contentItems: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
    });

    return nextStep;
  }

  /**
   * 트랜잭션 내 다음 Step 찾기
   */
  private async findNextStepInTransaction(
    tx: any,
    currentStepId: string,
    currentContentId: string,
    currentTopicId: string,
    groupId: string,
  ) {
    const currentStep = await tx.step.findUnique({
      where: { id: currentStepId },
    });

    if (!currentStep) {
      return null;
    }

    return await tx.step.findFirst({
      where: {
        contentId: currentContentId,
        order: { gt: currentStep.order },
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 다음 Content 찾기
   */
  private async findNextContent(
    currentContentId: string,
    currentTopicId: string,
    groupId: string,
  ) {
    const currentContent = await this.prisma.content.findUnique({
      where: { id: currentContentId },
    });

    if (!currentContent) {
      return null;
    }

    return await this.prisma.content.findFirst({
      where: {
        topicId: currentTopicId,
        order: { gt: currentContent.order },
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 트랜잭션 내 다음 Content 찾기
   */
  private async findNextContentInTransaction(
    tx: any,
    currentContentId: string,
    currentTopicId: string,
    groupId: string,
  ) {
    const currentContent = await tx.content.findUnique({
      where: { id: currentContentId },
    });

    if (!currentContent) {
      return null;
    }

    return await tx.content.findFirst({
      where: {
        topicId: currentTopicId,
        order: { gt: currentContent.order },
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 다음 Topic 찾기
   */
  private async findNextTopic(currentTopicId: string, groupId: string) {
    const currentTopic = await this.prisma.topic.findUnique({
      where: { id: currentTopicId },
    });

    if (!currentTopic) {
      return null;
    }

    return await this.prisma.topic.findFirst({
      where: {
        learningContentGroupId: groupId,
        order: { gt: currentTopic.order },
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 트랜잭션 내 다음 Topic 찾기
   */
  private async findNextTopicInTransaction(
    tx: any,
    currentTopicId: string,
    groupId: string,
  ) {
    const currentTopic = await tx.topic.findUnique({
      where: { id: currentTopicId },
    });

    if (!currentTopic) {
      return null;
    }

    return await tx.topic.findFirst({
      where: {
        learningContentGroupId: groupId,
        order: { gt: currentTopic.order },
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 진행률 계산
   */
  private async calculateProgressPercentage(
    groupId: string,
    progress: any,
  ): Promise<number> {
    const totalSteps = await this.prisma.step.count({
      where: {
        content: {
          topic: {
            learningContentGroupId: groupId,
            deletedAt: null,
          },
          deletedAt: null,
        },
        deletedAt: null,
      },
    });

    if (totalSteps === 0) {
      return 0;
    }

    if (progress.isCompleted) {
      return 100;
    }

    const completedSteps = await this.countCompletedSteps(
      groupId,
      progress.currentContentId || '',
      progress.currentStepId || '',
    );

    return (completedSteps / totalSteps) * 100;
  }

  /**
   * 오늘의 진행률 계산
   */
  private async calculateTodayProgressPercentage(
    groupId: string,
    session: any,
  ): Promise<number> {
    const totalSteps = await this.prisma.step.count({
      where: {
        content: {
          topic: {
            learningContentGroupId: groupId,
            deletedAt: null,
          },
          deletedAt: null,
        },
        deletedAt: null,
      },
    });

    if (totalSteps === 0) {
      return 0;
    }

    return (session.stepsCompleted / totalSteps) * 100;
  }

  /**
   * 완료한 Topic 수 계산 (현재 위치 기준)
   */
  private async countCompletedTopics(
    groupId: string,
    currentTopicId: string,
  ): Promise<number> {
    const currentTopic = await this.prisma.topic.findUnique({
      where: { id: currentTopicId },
    });

    if (!currentTopic) {
      return 0;
    }

    return await this.prisma.topic.count({
      where: {
        learningContentGroupId: groupId,
        order: { lt: currentTopic.order },
        deletedAt: null,
      },
    });
  }

  /**
   * 완료한 Content 수 계산 (현재 위치 기준)
   */
  private async countCompletedContents(
    groupId: string,
    currentTopicId: string,
    currentContentId: string,
  ): Promise<number> {
    const currentContent = await this.prisma.content.findUnique({
      where: { id: currentContentId },
    });

    if (!currentContent) {
      return 0;
    }

    return await this.prisma.content.count({
      where: {
        topicId: currentTopicId,
        order: { lt: currentContent.order },
        deletedAt: null,
      },
    });
  }

  /**
   * 완료한 Step 수 계산 (현재 위치 기준)
   */
  private async countCompletedSteps(
    groupId: string,
    currentContentId: string,
    currentStepId: string,
  ): Promise<number> {
    const currentStep = await this.prisma.step.findUnique({
      where: { id: currentStepId },
    });

    if (!currentStep) {
      return 0;
    }

    return await this.prisma.step.count({
      where: {
        contentId: currentContentId,
        order: { lt: currentStep.order },
        deletedAt: null,
      },
    });
  }

  /**
   * Progress를 Response DTO로 변환
   */
  private mapToProgressResponse(
    progress: any,
  ): LearningProgressResponseDto {
    return {
      id: progress.id,
      userId: progress.userId,
      learningContentGroupId: progress.learningContentGroupId,
      currentTopicId: progress.currentTopicId,
      currentContentId: progress.currentContentId,
      currentStepId: progress.currentStepId,
      isCompleted: progress.isCompleted,
      completedAt: progress.completedAt,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt,
    };
  }

  /**
   * Session을 Response DTO로 변환
   */
  private mapToSessionResponse(
    session: any,
  ): DailyLearningSessionResponseDto {
    return {
      id: session.id,
      userId: session.userId,
      learningContentGroupId: session.learningContentGroupId,
      sessionDate: session.sessionDate,
      topicsCompleted: session.topicsCompleted,
      contentsCompleted: session.contentsCompleted,
      stepsCompleted: session.stepsCompleted,
      lastLearningAt: session.lastLearningAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  /**
   * Topic을 Response DTO로 변환
   */
  private mapToTopicResponse(topic: any): TopicResponseDto {
    return {
      id: topic.id,
      learningContentGroupId: topic.learningContentGroupId,
      title: topic.title,
      description: topic.description,
      order: topic.order,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
      deletedAt: topic.deletedAt,
    };
  }

  /**
   * Content를 Response DTO로 변환
   */
  private mapToContentResponse(content: any): ContentResponseDto {
    return {
      id: content.id,
      topicId: content.topicId,
      title: content.title,
      order: content.order,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
      deletedAt: content.deletedAt,
    };
  }

  /**
   * Step을 Response DTO로 변환
   */
  private mapToStepResponse(step: any, contentItems: any[]): StepResponseDto {
    return {
      id: step.id,
      contentId: step.contentId,
      pageTitle: step.pageTitle,
      order: step.order,
      contentItems: contentItems.map((item) => ({
        id: item.id,
        stepId: item.stepId,
        type: item.type,
        order: item.order,
        data: item.data,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      })),
      createdAt: step.createdAt,
      updatedAt: step.updatedAt,
      deletedAt: step.deletedAt,
    };
  }
}

