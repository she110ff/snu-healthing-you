import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { DailyLearningService } from './daily-learning.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SelectGroupDto } from './dto/select-group.dto';
import { CompleteStepDto } from './dto/complete-step.dto';
import { LearningProgressResponseDto } from './dto/learning-progress-response.dto';
import { DailyLearningSessionResponseDto } from './dto/daily-learning-session-response.dto';
import { CurrentLearningContentResponseDto } from './dto/current-learning-content-response.dto';
import { DailyLearningSummaryResponseDto } from './dto/daily-learning-summary-response.dto';

@ApiTags('daily-learning')
@Controller('daily-learning')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
export class DailyLearningController {
  constructor(private readonly dailyLearningService: DailyLearningService) {}

  @Post('select-group')
  @ApiOperation({
    summary: '학습 그룹 선택',
    description:
      '학습할 그룹을 선택하거나 변경합니다. 진행 상태가 없으면 생성하고, 있으면 기존 상태를 반환합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '그룹이 성공적으로 선택되었습니다.',
    type: LearningProgressResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청입니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '학습 컨텐츠 그룹을 찾을 수 없습니다.',
  })
  async selectGroup(
    @Request() req: any,
    @Body() selectGroupDto: SelectGroupDto,
  ): Promise<LearningProgressResponseDto> {
    const userId = req.user.id;
    return this.dailyLearningService.selectGroup(
      userId,
      selectGroupDto.learningContentGroupId,
    );
  }

  @Get('current')
  @ApiOperation({
    summary: '현재 학습 중인 컨텐츠 조회',
    description:
      '현재 학습 중인 컨텐츠 정보를 조회합니다. groupId가 없으면 선택된 그룹을 사용합니다.',
  })
  @ApiQuery({
    name: 'groupId',
    required: false,
    description: '학습 컨텐츠 그룹 ID (선택적)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '현재 학습 중인 컨텐츠를 성공적으로 조회했습니다.',
    type: CurrentLearningContentResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '선택된 학습 그룹이 없습니다.',
  })
  async getCurrentLearningContent(
    @Request() req: any,
    @Query('groupId') groupId?: string,
  ): Promise<CurrentLearningContentResponseDto> {
    const userId = req.user.id;
    return this.dailyLearningService.getCurrentLearningContent(userId, groupId);
  }

  @Get('progress/:groupId')
  @ApiOperation({
    summary: '특정 그룹의 진행 상태 조회',
    description: '특정 그룹의 학습 진행 상태를 조회합니다.',
  })
  @ApiParam({
    name: 'groupId',
    description: '학습 컨텐츠 그룹 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '진행 상태를 성공적으로 조회했습니다.',
    type: LearningProgressResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '학습 진행 상태를 찾을 수 없습니다.',
  })
  async getProgress(
    @Request() req: any,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<LearningProgressResponseDto> {
    const userId = req.user.id;
    return this.dailyLearningService.getProgress(userId, groupId);
  }

  @Get('progress')
  @ApiOperation({
    summary: '모든 그룹의 진행 상태 조회',
    description: '사용자의 모든 그룹에 대한 학습 진행 상태를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '진행 상태 목록을 성공적으로 조회했습니다.',
    type: [LearningProgressResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async getAllProgress(
    @Request() req: any,
  ): Promise<LearningProgressResponseDto[]> {
    const userId = req.user.id;
    return this.dailyLearningService.getAllProgress(userId);
  }

  @Post('complete-step')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Step 완료 처리',
    description:
      '현재 학습 중인 Step을 완료 처리하고 다음 Step으로 진행 상태를 업데이트합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'Step이 성공적으로 완료되었습니다.',
    type: LearningProgressResponseDto,
  })
  @ApiBadRequestResponse({
    description: '현재 진행 중인 Step이 아닙니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: 'Step 또는 학습 진행 상태를 찾을 수 없습니다.',
  })
  async completeStep(
    @Request() req: any,
    @Body() completeStepDto: CompleteStepDto,
  ): Promise<LearningProgressResponseDto> {
    const userId = req.user.id;
    return this.dailyLearningService.completeStep(userId, completeStepDto.stepId);
  }

  @Get('summary')
  @ApiOperation({
    summary: '오늘의 학습 요약 조회',
    description:
      '선택된 그룹의 오늘의 학습 요약 정보를 조회합니다. 전체 통계와 오늘의 통계를 포함합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '오늘의 학습 요약을 성공적으로 조회했습니다.',
    type: DailyLearningSummaryResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '선택된 학습 그룹이 없습니다.',
  })
  async getDailyLearningSummary(
    @Request() req: any,
  ): Promise<DailyLearningSummaryResponseDto> {
    const userId = req.user.id;
    return this.dailyLearningService.getDailyLearningSummary(userId);
  }

  @Get('session/:groupId')
  @ApiOperation({
    summary: '오늘의 학습 세션 조회',
    description: '특정 그룹의 오늘의 학습 세션을 조회합니다.',
  })
  @ApiParam({
    name: 'groupId',
    description: '학습 컨텐츠 그룹 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '오늘의 학습 세션을 성공적으로 조회했습니다.',
    type: DailyLearningSessionResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  @ApiNotFoundResponse({
    description: '학습 진행 상태를 찾을 수 없습니다.',
  })
  async getTodaySession(
    @Request() req: any,
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<DailyLearningSessionResponseDto> {
    const userId = req.user.id;
    return this.dailyLearningService.getTodaySession(userId, groupId);
  }

  @Get('sessions')
  @ApiOperation({
    summary: '모든 그룹의 오늘 세션 조회',
    description: '사용자의 모든 그룹에 대한 오늘의 학습 세션을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '오늘의 학습 세션 목록을 성공적으로 조회했습니다.',
    type: [DailyLearningSessionResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async getAllTodaySessions(
    @Request() req: any,
  ): Promise<DailyLearningSessionResponseDto[]> {
    const userId = req.user.id;
    return this.dailyLearningService.getAllTodaySessions(userId);
  }
}

