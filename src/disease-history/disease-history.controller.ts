import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { DiseaseHistoryService } from './disease-history.service';
import { CreateDiseaseHistoryDto } from './dto/create-disease-history.dto';
import { UpdateDiseaseHistoryDto } from './dto/update-disease-history.dto';
import { DiseaseHistoryResponseDto } from './dto/disease-history-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('disease-history')
@Controller('disease-history')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class DiseaseHistoryController {
  constructor(
    private readonly diseaseHistoryService: DiseaseHistoryService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '질환 이력 생성 또는 업데이트',
    description:
      '질환 이력을 생성하거나 이미 존재하는 경우 업데이트합니다. 사용자당 하나의 질환 이력만 존재합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '질환 이력이 성공적으로 생성되었습니다.',
    type: DiseaseHistoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  create(
    @Request() req: any,
    @Body() createDiseaseHistoryDto: CreateDiseaseHistoryDto,
  ): Promise<DiseaseHistoryResponseDto> {
    const userId = req.user.id;
    return this.diseaseHistoryService.createOrUpdate(
      userId,
      createDiseaseHistoryDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: '질환 이력 조회',
    description: '현재 사용자의 질환 이력을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '질환 이력을 성공적으로 조회했습니다.',
    type: DiseaseHistoryResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  findOne(@Request() req: any): Promise<DiseaseHistoryResponseDto | null> {
    const userId = req.user.id;
    return this.diseaseHistoryService.findOne(userId);
  }

  @Patch()
  @ApiOperation({
    summary: '질환 이력 수정',
    description: '현재 사용자의 질환 이력을 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '질환 이력이 성공적으로 수정되었습니다.',
    type: DiseaseHistoryResponseDto,
  })
  @ApiNotFoundResponse({
    description: '질환 이력을 찾을 수 없습니다.',
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  update(
    @Request() req: any,
    @Body() updateDiseaseHistoryDto: UpdateDiseaseHistoryDto,
  ): Promise<DiseaseHistoryResponseDto> {
    const userId = req.user.id;
    return this.diseaseHistoryService.update(userId, updateDiseaseHistoryDto);
  }

  @Delete()
  @ApiOperation({
    summary: '질환 이력 삭제',
    description: '현재 사용자의 질환 이력을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '질환 이력이 성공적으로 삭제되었습니다.',
  })
  @ApiNotFoundResponse({
    description: '질환 이력을 찾을 수 없습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  remove(@Request() req: any): Promise<void> {
    const userId = req.user.id;
    return this.diseaseHistoryService.remove(userId);
  }
}

