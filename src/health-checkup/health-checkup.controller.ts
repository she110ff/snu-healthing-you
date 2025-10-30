import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { HealthCheckupService } from './health-checkup.service';
import { CreateHealthCheckupDto } from './dto/create-health-checkup.dto';
import { UpdateHealthCheckupDto } from './dto/update-health-checkup.dto';
import { HealthCheckupResponseDto } from './dto/health-checkup-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('health-checkup')
@Controller('health-checkup')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class HealthCheckupController {
  constructor(private readonly healthCheckupService: HealthCheckupService) {}

  @Post()
  @ApiOperation({
    summary: '건강검진 기록 생성',
    description: '새로운 건강검진 기록을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '건강검진 기록이 성공적으로 생성되었습니다.',
    type: HealthCheckupResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  create(
    @Request() req: any,
    @Body() createHealthCheckupDto: CreateHealthCheckupDto,
  ): Promise<HealthCheckupResponseDto> {
    const userId = req.user.id;
    return this.healthCheckupService.create(userId, createHealthCheckupDto);
  }

  @Get()
  @ApiOperation({
    summary: '건강검진 기록 목록 조회',
    description: '현재 사용자의 모든 건강검진 기록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '건강검진 기록 목록을 성공적으로 조회했습니다.',
    type: [HealthCheckupResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  findAll(@Request() req: any): Promise<HealthCheckupResponseDto[]> {
    const userId = req.user.id;
    return this.healthCheckupService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: '건강검진 기록 조회',
    description: '특정 건강검진 기록을 조회합니다.',
  })
  @ApiParam({ name: 'id', description: '건강검진 기록 ID (UUID)', type: String })
  @ApiResponse({
    status: 200,
    description: '건강검진 기록을 성공적으로 조회했습니다.',
    type: HealthCheckupResponseDto,
  })
  @ApiNotFoundResponse({
    description: '건강검진 기록을 찾을 수 없습니다.',
  })
  @ApiForbiddenResponse({
    description: '다른 사용자의 건강검진 기록은 조회할 수 없습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<HealthCheckupResponseDto> {
    const userId = req.user.id;
    return this.healthCheckupService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '건강검진 기록 수정',
    description: '특정 건강검진 기록을 수정합니다.',
  })
  @ApiParam({ name: 'id', description: '건강검진 기록 ID (UUID)', type: String })
  @ApiResponse({
    status: 200,
    description: '건강검진 기록이 성공적으로 수정되었습니다.',
    type: HealthCheckupResponseDto,
  })
  @ApiNotFoundResponse({
    description: '건강검진 기록을 찾을 수 없습니다.',
  })
  @ApiForbiddenResponse({
    description: '다른 사용자의 건강검진 기록은 수정할 수 없습니다.',
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
    @Body() updateHealthCheckupDto: UpdateHealthCheckupDto,
  ): Promise<HealthCheckupResponseDto> {
    const userId = req.user.id;
    return this.healthCheckupService.update(id, userId, updateHealthCheckupDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '건강검진 기록 삭제',
    description: '특정 건강검진 기록을 삭제합니다.',
  })
  @ApiParam({ name: 'id', description: '건강검진 기록 ID (UUID)', type: String })
  @ApiResponse({
    status: 200,
    description: '건강검진 기록이 성공적으로 삭제되었습니다.',
  })
  @ApiNotFoundResponse({
    description: '건강검진 기록을 찾을 수 없습니다.',
  })
  @ApiForbiddenResponse({
    description: '다른 사용자의 건강검진 기록은 삭제할 수 없습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<void> {
    const userId = req.user.id;
    return this.healthCheckupService.remove(id, userId);
  }
}

