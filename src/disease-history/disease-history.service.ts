import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiseaseHistoryDto } from './dto/create-disease-history.dto';
import { UpdateDiseaseHistoryDto } from './dto/update-disease-history.dto';
import { DiseaseHistoryResponseDto } from './dto/disease-history-response.dto';

@Injectable()
export class DiseaseHistoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * 질환 이력 생성 또는 업데이트
   * 사용자당 하나의 질환 이력만 존재하므로 upsert 사용
   */
  async createOrUpdate(
    userId: string,
    createDiseaseHistoryDto: CreateDiseaseHistoryDto,
  ): Promise<DiseaseHistoryResponseDto> {
    return this.prisma.diseaseHistory.upsert({
      where: { userId },
      create: {
        userId,
        chronicDiseases: createDiseaseHistoryDto.chronicDiseases || [],
        chronicRespiratoryDiseases:
          createDiseaseHistoryDto.chronicRespiratoryDiseases || [],
        chronicRespiratoryOther:
          createDiseaseHistoryDto.chronicRespiratoryOther || null,
        chronicArthritis: createDiseaseHistoryDto.chronicArthritis || [],
        osteoarthritis: createDiseaseHistoryDto.osteoarthritis || null,
        chronicArthritisOther:
          createDiseaseHistoryDto.chronicArthritisOther || null,
        pastChronicDiseases:
          createDiseaseHistoryDto.pastChronicDiseases || [],
        cancerHistory: createDiseaseHistoryDto.cancerHistory || [],
        cancerOther: createDiseaseHistoryDto.cancerOther || null,
        isSmoking: createDiseaseHistoryDto.isSmoking,
        isDrinking: createDiseaseHistoryDto.isDrinking,
      },
      update: {
        chronicDiseases: createDiseaseHistoryDto.chronicDiseases,
        chronicRespiratoryDiseases:
          createDiseaseHistoryDto.chronicRespiratoryDiseases,
        chronicRespiratoryOther:
          createDiseaseHistoryDto.chronicRespiratoryOther,
        chronicArthritis: createDiseaseHistoryDto.chronicArthritis,
        osteoarthritis: createDiseaseHistoryDto.osteoarthritis,
        chronicArthritisOther: createDiseaseHistoryDto.chronicArthritisOther,
        pastChronicDiseases: createDiseaseHistoryDto.pastChronicDiseases,
        cancerHistory: createDiseaseHistoryDto.cancerHistory,
        cancerOther: createDiseaseHistoryDto.cancerOther,
        isSmoking: createDiseaseHistoryDto.isSmoking,
        isDrinking: createDiseaseHistoryDto.isDrinking,
      },
    });
  }

  /**
   * 사용자의 질환 이력 조회
   */
  async findOne(userId: string): Promise<DiseaseHistoryResponseDto | null> {
    return this.prisma.diseaseHistory.findUnique({
      where: { userId },
    });
  }

  /**
   * 질환 이력 업데이트
   */
  async update(
    userId: string,
    updateDiseaseHistoryDto: UpdateDiseaseHistoryDto,
  ): Promise<DiseaseHistoryResponseDto> {
    // 기록 존재 확인
    const existing = await this.prisma.diseaseHistory.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('질환 이력을 찾을 수 없습니다.');
    }

    // undefined 값 제거
    const updateData: any = {};
    if (updateDiseaseHistoryDto.chronicDiseases !== undefined) {
      updateData.chronicDiseases = updateDiseaseHistoryDto.chronicDiseases;
    }
    if (updateDiseaseHistoryDto.chronicRespiratoryDiseases !== undefined) {
      updateData.chronicRespiratoryDiseases =
        updateDiseaseHistoryDto.chronicRespiratoryDiseases;
    }
    if (updateDiseaseHistoryDto.chronicRespiratoryOther !== undefined) {
      updateData.chronicRespiratoryOther =
        updateDiseaseHistoryDto.chronicRespiratoryOther;
    }
    if (updateDiseaseHistoryDto.chronicArthritis !== undefined) {
      updateData.chronicArthritis = updateDiseaseHistoryDto.chronicArthritis;
    }
    if (updateDiseaseHistoryDto.osteoarthritis !== undefined) {
      updateData.osteoarthritis = updateDiseaseHistoryDto.osteoarthritis;
    }
    if (updateDiseaseHistoryDto.chronicArthritisOther !== undefined) {
      updateData.chronicArthritisOther =
        updateDiseaseHistoryDto.chronicArthritisOther;
    }
    if (updateDiseaseHistoryDto.pastChronicDiseases !== undefined) {
      updateData.pastChronicDiseases =
        updateDiseaseHistoryDto.pastChronicDiseases;
    }
    if (updateDiseaseHistoryDto.cancerHistory !== undefined) {
      updateData.cancerHistory = updateDiseaseHistoryDto.cancerHistory;
    }
    if (updateDiseaseHistoryDto.cancerOther !== undefined) {
      updateData.cancerOther = updateDiseaseHistoryDto.cancerOther;
    }
    if (updateDiseaseHistoryDto.isSmoking !== undefined) {
      updateData.isSmoking = updateDiseaseHistoryDto.isSmoking;
    }
    if (updateDiseaseHistoryDto.isDrinking !== undefined) {
      updateData.isDrinking = updateDiseaseHistoryDto.isDrinking;
    }

    return this.prisma.diseaseHistory.update({
      where: { userId },
      data: updateData,
    });
  }

  /**
   * 질환 이력 삭제
   */
  async remove(userId: string): Promise<void> {
    const existing = await this.prisma.diseaseHistory.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('질환 이력을 찾을 수 없습니다.');
    }

    await this.prisma.diseaseHistory.delete({
      where: { userId },
    });
  }
}

