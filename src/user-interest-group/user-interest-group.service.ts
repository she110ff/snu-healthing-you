import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInterestGroupDto } from './dto/create-user-interest-group.dto';
import { UpdateUserInterestGroupDto } from './dto/update-user-interest-group.dto';
import { UserInterestGroupResponseDto } from './dto/user-interest-group-response.dto';

@Injectable()
export class UserInterestGroupService {
  constructor(private prisma: PrismaService) {}

  /**
   * 사용자 관심 그룹 생성 또는 업데이트
   * 사용자당 하나의 관심 그룹만 존재하므로 upsert 사용
   */
  async createOrUpdate(
    userId: string,
    createUserInterestGroupDto: CreateUserInterestGroupDto,
  ): Promise<UserInterestGroupResponseDto> {
    // LearningContentGroup 존재 여부 확인
    const learningContentGroup = await this.prisma.learningContentGroup.findUnique({
      where: { id: createUserInterestGroupDto.learningContentGroupId },
    });

    if (!learningContentGroup) {
      throw new NotFoundException('학습 컨텐츠 그룹을 찾을 수 없습니다.');
    }

    // 삭제된 그룹인지 확인
    if (learningContentGroup.deletedAt) {
      throw new BadRequestException('삭제된 학습 컨텐츠 그룹입니다.');
    }

    return this.prisma.userInterestGroup.upsert({
      where: { userId },
      create: {
        userId,
        learningContentGroupId: createUserInterestGroupDto.learningContentGroupId,
      },
      update: {
        learningContentGroupId: createUserInterestGroupDto.learningContentGroupId,
      },
    });
  }

  /**
   * 사용자의 관심 그룹 조회
   */
  async findOne(userId: string): Promise<UserInterestGroupResponseDto | null> {
    return this.prisma.userInterestGroup.findUnique({
      where: { userId },
    });
  }

  /**
   * 사용자 관심 그룹 업데이트
   */
  async update(
    userId: string,
    updateUserInterestGroupDto: UpdateUserInterestGroupDto,
  ): Promise<UserInterestGroupResponseDto> {
    // 기록 존재 확인
    const existing = await this.prisma.userInterestGroup.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('사용자 관심 그룹을 찾을 수 없습니다.');
    }

    // LearningContentGroupId가 제공된 경우 유효성 검증
    if (updateUserInterestGroupDto.learningContentGroupId !== undefined) {
      const learningContentGroup = await this.prisma.learningContentGroup.findUnique({
        where: { id: updateUserInterestGroupDto.learningContentGroupId },
      });

      if (!learningContentGroup) {
        throw new NotFoundException('학습 컨텐츠 그룹을 찾을 수 없습니다.');
      }

      if (learningContentGroup.deletedAt) {
        throw new BadRequestException('삭제된 학습 컨텐츠 그룹입니다.');
      }
    }

    // undefined 값 제거
    const updateData: any = {};
    if (updateUserInterestGroupDto.learningContentGroupId !== undefined) {
      updateData.learningContentGroupId = updateUserInterestGroupDto.learningContentGroupId;
    }

    return this.prisma.userInterestGroup.update({
      where: { userId },
      data: updateData,
    });
  }

  /**
   * 사용자 관심 그룹 삭제
   */
  async remove(userId: string): Promise<void> {
    const existing = await this.prisma.userInterestGroup.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('사용자 관심 그룹을 찾을 수 없습니다.');
    }

    await this.prisma.userInterestGroup.delete({
      where: { userId },
    });
  }
}

