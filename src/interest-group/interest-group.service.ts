import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterestGroupDto } from './dto/create-interest-group.dto';
import { UpdateInterestGroupDto } from './dto/update-interest-group.dto';
import { InterestGroupResponseDto } from './dto/interest-group-response.dto';

@Injectable()
export class InterestGroupService {
  constructor(private prisma: PrismaService) {}

  /**
   * 관심 그룹 생성 또는 업데이트
   * 사용자당 하나의 관심 그룹만 존재하므로 upsert 사용
   */
  async createOrUpdate(
    userId: string,
    createInterestGroupDto: CreateInterestGroupDto,
  ): Promise<InterestGroupResponseDto> {
    return this.prisma.interestGroup.upsert({
      where: { userId },
      create: {
        userId,
        group: createInterestGroupDto.group,
      },
      update: {
        group: createInterestGroupDto.group,
      },
    });
  }

  /**
   * 사용자의 관심 그룹 조회
   */
  async findOne(userId: string): Promise<InterestGroupResponseDto | null> {
    return this.prisma.interestGroup.findUnique({
      where: { userId },
    });
  }

  /**
   * 관심 그룹 업데이트
   */
  async update(
    userId: string,
    updateInterestGroupDto: UpdateInterestGroupDto,
  ): Promise<InterestGroupResponseDto> {
    // 기록 존재 확인
    const existing = await this.prisma.interestGroup.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('관심 그룹을 찾을 수 없습니다.');
    }

    // undefined 값 제거
    const updateData: any = {};
    if (updateInterestGroupDto.group !== undefined) {
      updateData.group = updateInterestGroupDto.group;
    }

    return this.prisma.interestGroup.update({
      where: { userId },
      data: updateData,
    });
  }

  /**
   * 관심 그룹 삭제
   */
  async remove(userId: string): Promise<void> {
    const existing = await this.prisma.interestGroup.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('관심 그룹을 찾을 수 없습니다.');
    }

    await this.prisma.interestGroup.delete({
      where: { userId },
    });
  }
}

