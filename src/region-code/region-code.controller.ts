import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { RegionCodeService } from './region-code.service';
import { RegionResponseDto } from './dto/region-response.dto';
import { RegionDetailResponseDto } from './dto/region-detail-response.dto';

@ApiTags('region-codes')
@Controller('region-codes')
export class RegionCodeController {
  constructor(private readonly regionCodeService: RegionCodeService) {}

  @Get()
  @ApiOperation({
    summary: '시도 목록 조회',
    description: '모든 시도(SQ1) 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '시도 목록을 성공적으로 조회했습니다.',
    type: [RegionResponseDto],
  })
  async findAllRegions(): Promise<RegionResponseDto[]> {
    return this.regionCodeService.findAllRegions();
  }

  @Get(':sq1/details')
  @ApiOperation({
    summary: '시군구 목록 조회',
    description: '특정 시도(SQ1) 코드에 속하는 시군구(RR_SQ2) 목록을 조회합니다. RR_SQ2의 앞 두 자리와 SQ1을 매칭합니다.',
  })
  @ApiParam({
    name: 'sq1',
    description: '시도 코드 (SQ1)',
    example: '11',
  })
  @ApiResponse({
    status: 200,
    description: '시군구 목록을 성공적으로 조회했습니다.',
    type: [RegionDetailResponseDto],
  })
  @ApiNotFoundResponse({
    description: '시도 코드를 찾을 수 없습니다.',
  })
  async findDetailsByRegionCode(
    @Param('sq1') sq1: string,
  ): Promise<RegionDetailResponseDto[]> {
    return this.regionCodeService.findDetailsByRegionCode(sq1);
  }

  @Get('details/:rrSq2')
  @ApiOperation({
    summary: '시군구 상세 조회',
    description: '특정 시군구(RR_SQ2) 코드로 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'rrSq2',
    description: '시군구 코드 (RR_SQ2)',
    example: '11000',
  })
  @ApiResponse({
    status: 200,
    description: '시군구 정보를 성공적으로 조회했습니다.',
    type: RegionDetailResponseDto,
  })
  @ApiNotFoundResponse({
    description: '시군구 코드를 찾을 수 없습니다.',
  })
  async findDetailByCode(
    @Param('rrSq2') rrSq2: string,
  ): Promise<RegionDetailResponseDto> {
    return this.regionCodeService.findDetailByCode(rrSq2);
  }
}

