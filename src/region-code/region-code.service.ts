import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegionResponseDto } from './dto/region-response.dto';
import { RegionDetailResponseDto } from './dto/region-detail-response.dto';

@Injectable()
export class RegionCodeService {
  constructor(private prisma: PrismaService) {}

  /**
   * 모든 시도(SQ1) 목록 조회
   */
  async findAllRegions(): Promise<RegionResponseDto[]> {
    const regions = await this.prisma.region.findMany({
      orderBy: {
        code: 'asc',
      },
    });

    return regions.map((region) => ({
      code: region.code,
      name: region.name,
    }));
  }

  /**
   * 특정 시도(SQ1) 코드에 속하는 시군구(RR_SQ2) 목록 조회
   * RR_SQ2의 앞 두 자리와 SQ1을 매칭
   */
  async findDetailsByRegionCode(sq1: string): Promise<RegionDetailResponseDto[]> {
    // 먼저 Region이 존재하는지 확인
    const region = await this.prisma.region.findUnique({
      where: { code: sq1 },
    });

    if (!region) {
      throw new NotFoundException(`시도 코드 '${sq1}'를 찾을 수 없습니다.`);
    }

    // RR_SQ2 코드의 앞 두 자리가 SQ1과 일치하는 항목 조회
    const details = await this.prisma.regionDetail.findMany({
      where: {
        regionCode: sq1,
      },
      orderBy: {
        code: 'asc',
      },
    });

    return details.map((detail) => ({
      code: detail.code,
      name: detail.name,
      regionCode: detail.regionCode,
      regionName: region.name,
    }));
  }

  /**
   * 특정 시군구(RR_SQ2) 코드로 상세 정보 조회
   */
  async findDetailByCode(rrSq2: string): Promise<RegionDetailResponseDto> {
    const detail = await this.prisma.regionDetail.findUnique({
      where: { code: rrSq2 },
      include: {
        region: true,
      },
    });

    if (!detail) {
      throw new NotFoundException(`시군구 코드 '${rrSq2}'를 찾을 수 없습니다.`);
    }

    return {
      code: detail.code,
      name: detail.name,
      regionCode: detail.regionCode,
      regionName: detail.region.name,
    };
  }
}

