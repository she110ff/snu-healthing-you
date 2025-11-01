import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHealthCheckupDto } from './dto/create-health-checkup.dto';
import { UpdateHealthCheckupDto } from './dto/update-health-checkup.dto';
import { HealthCheckupResponseDto } from './dto/health-checkup-response.dto';

@Injectable()
export class HealthCheckupService {
  constructor(private prisma: PrismaService) {}

  /**
   * 건강검진 기록 생성
   */
  async create(
    userId: string,
    createHealthCheckupDto: CreateHealthCheckupDto,
  ): Promise<HealthCheckupResponseDto> {
    // 빈 객체 체크: 최소한 하나의 필드는 있어야 함
    const hasAnyData = Object.keys(createHealthCheckupDto).some(
      (key) => createHealthCheckupDto[key] !== undefined && createHealthCheckupDto[key] !== null,
    );

    if (!hasAnyData) {
      throw new BadRequestException('건강검진 기록에는 최소한 하나의 데이터가 필요합니다.');
    }

    const { checkupDate, ...data } = createHealthCheckupDto;

    return this.prisma.healthCheckup.create({
      data: {
        userId,
        checkupDate: checkupDate ? new Date(checkupDate) : null,
        ...data,
      },
    });
  }

  /**
   * 사용자의 모든 건강검진 기록 조회
   */
  async findAll(userId: string): Promise<HealthCheckupResponseDto[]> {
    return this.prisma.healthCheckup.findMany({
      where: {
        userId,
      },
      orderBy: {
        checkupDate: 'desc',
      },
    });
  }

  /**
   * 특정 건강검진 기록 조회
   */
  async findOne(
    id: string,
    userId: string,
  ): Promise<HealthCheckupResponseDto> {
    const checkup = await this.prisma.healthCheckup.findUnique({
      where: { id },
    });

    if (!checkup) {
      throw new NotFoundException('건강검진 기록을 찾을 수 없습니다.');
    }

    // 본인의 기록만 조회 가능
    if (checkup.userId !== userId) {
      throw new ForbiddenException(
        '다른 사용자의 건강검진 기록은 조회할 수 없습니다.',
      );
    }

    return checkup;
  }

  /**
   * 건강검진 기록 수정
   */
  async update(
    id: string,
    userId: string,
    updateHealthCheckupDto: UpdateHealthCheckupDto,
  ): Promise<HealthCheckupResponseDto> {
    // 기록 존재 및 소유권 확인
    const checkup = await this.findOne(id, userId);

    const { checkupDate, ...data } = updateHealthCheckupDto;

    return this.prisma.healthCheckup.update({
      where: { id },
      data: {
        ...data,
        checkupDate: checkupDate ? new Date(checkupDate) : checkupDate === null ? null : undefined,
      },
    });
  }

  /**
   * 건강검진 기록 삭제
   */
  async remove(id: string, userId: string): Promise<void> {
    // 기록 존재 및 소유권 확인
    await this.findOne(id, userId);

    await this.prisma.healthCheckup.delete({
      where: { id },
    });
  }
}

