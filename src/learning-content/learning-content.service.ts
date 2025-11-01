import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLearningContentGroupDto } from './dto/create-learning-content-group.dto';
import { UpdateLearningContentGroupDto } from './dto/update-learning-content-group.dto';
import { LearningContentGroupResponseDto } from './dto/learning-content-group-response.dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicResponseDto } from './dto/topic-response.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentResponseDto } from './dto/content-response.dto';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { StepResponseDto } from './dto/step-response.dto';

@Injectable()
export class LearningContentService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // LearningContentGroup CRUD
  // ============================================

  async createLearningContentGroup(
    createDto: CreateLearningContentGroupDto,
  ): Promise<LearningContentGroupResponseDto> {
    const group = await this.prisma.learningContentGroup.create({
      data: {
        name: createDto.name,
        description: createDto.description,
      },
    });

    return this.mapToLearningContentGroupResponse(group);
  }

  async findAllLearningContentGroups(): Promise<
    LearningContentGroupResponseDto[]
  > {
    const groups = await this.prisma.learningContentGroup.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return groups.map((group) =>
      this.mapToLearningContentGroupResponse(group),
    );
  }

  async findOneLearningContentGroup(
    id: string,
  ): Promise<LearningContentGroupResponseDto> {
    const group = await this.prisma.learningContentGroup.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!group) {
      throw new NotFoundException(
        `학습 컨텐츠 그룹을 찾을 수 없습니다. (ID: ${id})`,
      );
    }

    return this.mapToLearningContentGroupResponse(group);
  }

  async updateLearningContentGroup(
    id: string,
    updateDto: UpdateLearningContentGroupDto,
  ): Promise<LearningContentGroupResponseDto> {
    const existing = await this.prisma.learningContentGroup.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `학습 컨텐츠 그룹을 찾을 수 없습니다. (ID: ${id})`,
      );
    }

    const updated = await this.prisma.learningContentGroup.update({
      where: { id },
      data: {
        name: updateDto.name,
        description: updateDto.description,
      },
    });

    return this.mapToLearningContentGroupResponse(updated);
  }

  async removeLearningContentGroup(id: string): Promise<void> {
    const group = await this.prisma.learningContentGroup.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!group) {
      throw new NotFoundException(
        `학습 컨텐츠 그룹을 찾을 수 없습니다. (ID: ${id})`,
      );
    }

    // 소프트 삭제
    await this.prisma.learningContentGroup.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ============================================
  // Topic CRUD
  // ============================================

  async createTopic(createDto: CreateTopicDto): Promise<TopicResponseDto> {
    // 그룹 존재 확인
    const group = await this.prisma.learningContentGroup.findFirst({
      where: {
        id: createDto.learningContentGroupId,
        deletedAt: null,
      },
    });

    if (!group) {
      throw new NotFoundException(
        `학습 컨텐츠 그룹을 찾을 수 없습니다. (ID: ${createDto.learningContentGroupId})`,
      );
    }

    const topic = await this.prisma.topic.create({
      data: {
        learningContentGroupId: createDto.learningContentGroupId,
        title: createDto.title,
        description: createDto.description,
        order: createDto.order,
      },
    });

    return this.mapToTopicResponse(topic);
  }

  async findAllTopicsByGroup(
    groupId: string,
  ): Promise<TopicResponseDto[]> {
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

    const topics = await this.prisma.topic.findMany({
      where: {
        learningContentGroupId: groupId,
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });

    return topics.map((topic) => this.mapToTopicResponse(topic));
  }

  async findOneTopic(id: string): Promise<TopicResponseDto> {
    const topic = await this.prisma.topic.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!topic) {
      throw new NotFoundException(`주제를 찾을 수 없습니다. (ID: ${id})`);
    }

    return this.mapToTopicResponse(topic);
  }

  async updateTopic(
    id: string,
    updateDto: UpdateTopicDto,
  ): Promise<TopicResponseDto> {
    const existing = await this.prisma.topic.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new NotFoundException(`주제를 찾을 수 없습니다. (ID: ${id})`);
    }

    // learningContentGroupId가 변경되는 경우 그룹 존재 확인
    if (updateDto.learningContentGroupId) {
      const group = await this.prisma.learningContentGroup.findFirst({
        where: {
          id: updateDto.learningContentGroupId,
          deletedAt: null,
        },
      });

      if (!group) {
        throw new NotFoundException(
          `학습 컨텐츠 그룹을 찾을 수 없습니다. (ID: ${updateDto.learningContentGroupId})`,
        );
      }
    }

    const updated = await this.prisma.topic.update({
      where: { id },
      data: {
        learningContentGroupId: updateDto.learningContentGroupId,
        title: updateDto.title,
        description: updateDto.description,
        order: updateDto.order,
      },
    });

    return this.mapToTopicResponse(updated);
  }

  async removeTopic(id: string): Promise<void> {
    const topic = await this.prisma.topic.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!topic) {
      throw new NotFoundException(`주제를 찾을 수 없습니다. (ID: ${id})`);
    }

    // 소프트 삭제
    await this.prisma.topic.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ============================================
  // Content CRUD
  // ============================================

  async createContent(createDto: CreateContentDto): Promise<ContentResponseDto> {
    // 주제 존재 확인
    const topic = await this.prisma.topic.findFirst({
      where: {
        id: createDto.topicId,
        deletedAt: null,
      },
    });

    if (!topic) {
      throw new NotFoundException(
        `주제를 찾을 수 없습니다. (ID: ${createDto.topicId})`,
      );
    }

    const content = await this.prisma.content.create({
      data: {
        topicId: createDto.topicId,
        title: createDto.title,
        order: createDto.order,
      },
    });

    return this.mapToContentResponse(content);
  }

  async findAllContentsByTopic(
    topicId: string,
  ): Promise<ContentResponseDto[]> {
    const topic = await this.prisma.topic.findFirst({
      where: {
        id: topicId,
        deletedAt: null,
      },
    });

    if (!topic) {
      throw new NotFoundException(`주제를 찾을 수 없습니다. (ID: ${topicId})`);
    }

    const contents = await this.prisma.content.findMany({
      where: {
        topicId,
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
    });

    return contents.map((content) => this.mapToContentResponse(content));
  }

  async findOneContent(id: string): Promise<ContentResponseDto> {
    const content = await this.prisma.content.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!content) {
      throw new NotFoundException(`컨텐츠를 찾을 수 없습니다. (ID: ${id})`);
    }

    return this.mapToContentResponse(content);
  }

  async updateContent(
    id: string,
    updateDto: UpdateContentDto,
  ): Promise<ContentResponseDto> {
    const existing = await this.prisma.content.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new NotFoundException(`컨텐츠를 찾을 수 없습니다. (ID: ${id})`);
    }

    // topicId가 변경되는 경우 주제 존재 확인
    if (updateDto.topicId) {
      const topic = await this.prisma.topic.findFirst({
        where: {
          id: updateDto.topicId,
          deletedAt: null,
        },
      });

      if (!topic) {
        throw new NotFoundException(
          `주제를 찾을 수 없습니다. (ID: ${updateDto.topicId})`,
        );
      }
    }

    const updated = await this.prisma.content.update({
      where: { id },
      data: {
        topicId: updateDto.topicId,
        title: updateDto.title,
        order: updateDto.order,
      },
    });

    return this.mapToContentResponse(updated);
  }

  async removeContent(id: string): Promise<void> {
    const content = await this.prisma.content.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!content) {
      throw new NotFoundException(`컨텐츠를 찾을 수 없습니다. (ID: ${id})`);
    }

    // 소프트 삭제
    await this.prisma.content.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ============================================
  // Step CRUD
  // ============================================

  async createStep(createDto: CreateStepDto): Promise<StepResponseDto> {
    // 컨텐츠 존재 확인
    const content = await this.prisma.content.findFirst({
      where: {
        id: createDto.contentId,
        deletedAt: null,
      },
    });

    if (!content) {
      throw new NotFoundException(
        `컨텐츠를 찾을 수 없습니다. (ID: ${createDto.contentId})`,
      );
    }

    // 트랜잭션으로 Step과 StepContentItem을 함께 생성
    const result = await this.prisma.$transaction(async (tx) => {
      const step = await tx.step.create({
        data: {
          contentId: createDto.contentId,
          pageTitle: createDto.pageTitle,
          order: createDto.order,
        },
      });

      // 컨텐츠 아이템 생성
      const contentItems = await Promise.all(
        createDto.contentItems.map((item) =>
          tx.stepContentItem.create({
            data: {
              stepId: step.id,
              type: item.type,
              order: item.order,
              data: item.data,
            },
          }),
        ),
      );

      return { step, contentItems };
    });

    return this.mapToStepResponse(result.step, result.contentItems);
  }

  async findAllStepsByContent(
    contentId: string,
  ): Promise<StepResponseDto[]> {
    const content = await this.prisma.content.findFirst({
      where: {
        id: contentId,
        deletedAt: null,
      },
    });

    if (!content) {
      throw new NotFoundException(
        `컨텐츠를 찾을 수 없습니다. (ID: ${contentId})`,
      );
    }

    const steps = await this.prisma.step.findMany({
      where: {
        contentId,
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

    return steps.map((step) =>
      this.mapToStepResponse(
        step,
        step.contentItems.map((item) => ({
          id: item.id,
          stepId: item.stepId,
          type: item.type,
          order: item.order,
          data: item.data,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          deletedAt: item.deletedAt,
        })),
      ),
    );
  }

  async findOneStep(id: string): Promise<StepResponseDto> {
    const step = await this.prisma.step.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        contentItems: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!step) {
      throw new NotFoundException(`스텝을 찾을 수 없습니다. (ID: ${id})`);
    }

    return this.mapToStepResponse(
      step,
      step.contentItems.map((item) => ({
        id: item.id,
        stepId: item.stepId,
        type: item.type,
        order: item.order,
        data: item.data,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      })),
    );
  }

  async updateStep(
    id: string,
    updateDto: UpdateStepDto,
  ): Promise<StepResponseDto> {
    const existing = await this.prisma.step.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new NotFoundException(`스텝을 찾을 수 없습니다. (ID: ${id})`);
    }

    // contentId가 변경되는 경우 컨텐츠 존재 확인
    if (updateDto.contentId) {
      const content = await this.prisma.content.findFirst({
        where: {
          id: updateDto.contentId,
          deletedAt: null,
        },
      });

      if (!content) {
        throw new NotFoundException(
          `컨텐츠를 찾을 수 없습니다. (ID: ${updateDto.contentId})`,
        );
      }
    }

    // 트랜잭션으로 Step과 StepContentItem 업데이트
    const result = await this.prisma.$transaction(async (tx) => {
      // 기존 컨텐츠 아이템 소프트 삭제
      if (updateDto.contentItems) {
        await tx.stepContentItem.updateMany({
          where: { stepId: id, deletedAt: null },
          data: { deletedAt: new Date() },
        });
      }

      // Step 업데이트
      const step = await tx.step.update({
        where: { id },
        data: {
          contentId: updateDto.contentId,
          pageTitle: updateDto.pageTitle,
          order: updateDto.order,
        },
      });

      // 새 컨텐츠 아이템 생성
      let contentItems = [];
      if (updateDto.contentItems && updateDto.contentItems.length > 0) {
        contentItems = await Promise.all(
          updateDto.contentItems.map((item) =>
            tx.stepContentItem.create({
              data: {
                stepId: step.id,
                type: item.type,
                order: item.order,
                data: item.data,
              },
            }),
          ),
        );
      } else {
        // 기존 아이템 조회
        const existingItems = await tx.stepContentItem.findMany({
          where: { stepId: id, deletedAt: null },
          orderBy: { order: 'asc' },
        });
        contentItems = existingItems;
      }

      return { step, contentItems };
    });

    return this.mapToStepResponse(
      result.step,
      result.contentItems.map((item) => ({
        id: item.id,
        stepId: item.stepId,
        type: item.type,
        order: item.order,
        data: item.data,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      })),
    );
  }

  async removeStep(id: string): Promise<void> {
    const step = await this.prisma.step.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!step) {
      throw new NotFoundException(`스텝을 찾을 수 없습니다. (ID: ${id})`);
    }

    // 소프트 삭제
    await this.prisma.step.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ============================================
  // Helper Methods
  // ============================================

  private mapToLearningContentGroupResponse(
    group: any,
  ): LearningContentGroupResponseDto {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      deletedAt: group.deletedAt,
    };
  }

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

