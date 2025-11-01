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
  HttpCode,
  HttpStatus,
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
} from '@nestjs/swagger';
import { LearningContentService } from './learning-content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
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

@ApiTags('learning-content')
@Controller('admin/learning-content')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('bearer')
export class LearningContentController {
  constructor(
    private readonly learningContentService: LearningContentService,
  ) {}

  // ============================================
  // LearningContentGroup APIs
  // ============================================

  @Post('groups')
  @ApiOperation({
    summary: '[관리자] 학습 컨텐츠 그룹 생성',
    description: '관리자가 학습 컨텐츠 그룹을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '학습 컨텐츠 그룹이 성공적으로 생성되었습니다.',
    type: LearningContentGroupResponseDto,
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async createLearningContentGroup(
    @Body() createDto: CreateLearningContentGroupDto,
  ): Promise<LearningContentGroupResponseDto> {
    return this.learningContentService.createLearningContentGroup(createDto);
  }

  @Get('groups')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '학습 컨텐츠 그룹 목록 조회',
    description: '모든 학습 컨텐츠 그룹을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '학습 컨텐츠 그룹 목록',
    type: [LearningContentGroupResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async findAllLearningContentGroups(): Promise<
    LearningContentGroupResponseDto[]
  > {
    return this.learningContentService.findAllLearningContentGroups();
  }

  @Get('groups/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '학습 컨텐츠 그룹 조회',
    description: '특정 학습 컨텐츠 그룹을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '학습 컨텐츠 그룹 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '학습 컨텐츠 그룹 정보',
    type: LearningContentGroupResponseDto,
  })
  @ApiNotFoundResponse({
    description: '학습 컨텐츠 그룹을 찾을 수 없습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async findOneLearningContentGroup(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LearningContentGroupResponseDto> {
    return this.learningContentService.findOneLearningContentGroup(id);
  }

  @Patch('groups/:id')
  @ApiOperation({
    summary: '[관리자] 학습 컨텐츠 그룹 수정',
    description: '학습 컨텐츠 그룹 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '학습 컨텐츠 그룹 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '학습 컨텐츠 그룹이 성공적으로 수정되었습니다.',
    type: LearningContentGroupResponseDto,
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @ApiNotFoundResponse({
    description: '학습 컨텐츠 그룹을 찾을 수 없습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async updateLearningContentGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateLearningContentGroupDto,
  ): Promise<LearningContentGroupResponseDto> {
    return this.learningContentService.updateLearningContentGroup(id, updateDto);
  }

  @Delete('groups/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '[관리자] 학습 컨텐츠 그룹 삭제',
    description: '학습 컨텐츠 그룹을 삭제합니다. (소프트 삭제)',
  })
  @ApiParam({
    name: 'id',
    description: '학습 컨텐츠 그룹 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: '학습 컨텐츠 그룹이 성공적으로 삭제되었습니다.',
  })
  @ApiNotFoundResponse({
    description: '학습 컨텐츠 그룹을 찾을 수 없습니다.',
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async removeLearningContentGroup(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.learningContentService.removeLearningContentGroup(id);
  }

  // ============================================
  // Topic APIs
  // ============================================

  @Post('topics')
  @ApiOperation({
    summary: '[관리자] 주제 생성',
    description: '관리자가 주제를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '주제가 성공적으로 생성되었습니다.',
    type: TopicResponseDto,
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async createTopic(@Body() createDto: CreateTopicDto): Promise<TopicResponseDto> {
    return this.learningContentService.createTopic(createDto);
  }

  @Get('groups/:groupId/topics')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '그룹별 주제 목록 조회',
    description: '특정 그룹의 모든 주제를 조회합니다.',
  })
  @ApiParam({
    name: 'groupId',
    description: '학습 컨텐츠 그룹 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '주제 목록',
    type: [TopicResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async findAllTopicsByGroup(
    @Param('groupId', ParseUUIDPipe) groupId: string,
  ): Promise<TopicResponseDto[]> {
    return this.learningContentService.findAllTopicsByGroup(groupId);
  }

  @Get('topics/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '주제 조회',
    description: '특정 주제를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '주제 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '주제 정보',
    type: TopicResponseDto,
  })
  @ApiNotFoundResponse({ description: '주제를 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async findOneTopic(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TopicResponseDto> {
    return this.learningContentService.findOneTopic(id);
  }

  @Patch('topics/:id')
  @ApiOperation({
    summary: '[관리자] 주제 수정',
    description: '주제 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '주제 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '주제가 성공적으로 수정되었습니다.',
    type: TopicResponseDto,
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @ApiNotFoundResponse({ description: '주제를 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async updateTopic(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTopicDto,
  ): Promise<TopicResponseDto> {
    return this.learningContentService.updateTopic(id, updateDto);
  }

  @Delete('topics/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '[관리자] 주제 삭제',
    description: '주제를 삭제합니다. (소프트 삭제)',
  })
  @ApiParam({
    name: 'id',
    description: '주제 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: '주제가 성공적으로 삭제되었습니다.',
  })
  @ApiNotFoundResponse({ description: '주제를 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async removeTopic(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.learningContentService.removeTopic(id);
  }

  // ============================================
  // Content APIs
  // ============================================

  @Post('contents')
  @ApiOperation({
    summary: '[관리자] 컨텐츠 생성',
    description: '관리자가 컨텐츠를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '컨텐츠가 성공적으로 생성되었습니다.',
    type: ContentResponseDto,
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async createContent(
    @Body() createDto: CreateContentDto,
  ): Promise<ContentResponseDto> {
    return this.learningContentService.createContent(createDto);
  }

  @Get('topics/:topicId/contents')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '주제별 컨텐츠 목록 조회',
    description: '특정 주제의 모든 컨텐츠를 조회합니다.',
  })
  @ApiParam({
    name: 'topicId',
    description: '주제 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '컨텐츠 목록',
    type: [ContentResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async findAllContentsByTopic(
    @Param('topicId', ParseUUIDPipe) topicId: string,
  ): Promise<ContentResponseDto[]> {
    return this.learningContentService.findAllContentsByTopic(topicId);
  }

  @Get('contents/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '컨텐츠 조회',
    description: '특정 컨텐츠를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '컨텐츠 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '컨텐츠 정보',
    type: ContentResponseDto,
  })
  @ApiNotFoundResponse({ description: '컨텐츠를 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async findOneContent(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ContentResponseDto> {
    return this.learningContentService.findOneContent(id);
  }

  @Patch('contents/:id')
  @ApiOperation({
    summary: '[관리자] 컨텐츠 수정',
    description: '컨텐츠 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '컨텐츠 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '컨텐츠가 성공적으로 수정되었습니다.',
    type: ContentResponseDto,
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @ApiNotFoundResponse({ description: '컨텐츠를 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async updateContent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateContentDto,
  ): Promise<ContentResponseDto> {
    return this.learningContentService.updateContent(id, updateDto);
  }

  @Delete('contents/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '[관리자] 컨텐츠 삭제',
    description: '컨텐츠를 삭제합니다. (소프트 삭제)',
  })
  @ApiParam({
    name: 'id',
    description: '컨텐츠 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: '컨텐츠가 성공적으로 삭제되었습니다.',
  })
  @ApiNotFoundResponse({ description: '컨텐츠를 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async removeContent(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.learningContentService.removeContent(id);
  }

  // ============================================
  // Step APIs
  // ============================================

  @Post('steps')
  @ApiOperation({
    summary: '[관리자] 스텝 생성',
    description: '관리자가 스텝과 컨텐츠 아이템을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '스텝이 성공적으로 생성되었습니다.',
    type: StepResponseDto,
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async createStep(@Body() createDto: CreateStepDto): Promise<StepResponseDto> {
    return this.learningContentService.createStep(createDto);
  }

  @Get('contents/:contentId/steps')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '컨텐츠별 스텝 목록 조회',
    description: '특정 컨텐츠의 모든 스텝을 조회합니다.',
  })
  @ApiParam({
    name: 'contentId',
    description: '컨텐츠 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '스텝 목록',
    type: [StepResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async findAllStepsByContent(
    @Param('contentId', ParseUUIDPipe) contentId: string,
  ): Promise<StepResponseDto[]> {
    return this.learningContentService.findAllStepsByContent(contentId);
  }

  @Get('steps/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '스텝 조회',
    description: '특정 스텝과 컨텐츠 아이템을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '스텝 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '스텝 정보',
    type: StepResponseDto,
  })
  @ApiNotFoundResponse({ description: '스텝을 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요합니다.',
  })
  async findOneStep(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StepResponseDto> {
    return this.learningContentService.findOneStep(id);
  }

  @Patch('steps/:id')
  @ApiOperation({
    summary: '[관리자] 스텝 수정',
    description: '스텝과 컨텐츠 아이템을 수정합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '스텝 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '스텝이 성공적으로 수정되었습니다.',
    type: StepResponseDto,
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @ApiNotFoundResponse({ description: '스텝을 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async updateStep(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateStepDto,
  ): Promise<StepResponseDto> {
    return this.learningContentService.updateStep(id, updateDto);
  }

  @Delete('steps/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '[관리자] 스텝 삭제',
    description: '스텝을 삭제합니다. (소프트 삭제)',
  })
  @ApiParam({
    name: 'id',
    description: '스텝 ID (UUID)',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: '스텝이 성공적으로 삭제되었습니다.',
  })
  @ApiNotFoundResponse({ description: '스텝을 찾을 수 없습니다.' })
  @ApiUnauthorizedResponse({
    description: '인증이 필요하거나 관리자 권한이 필요합니다.',
  })
  async removeStep(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.learningContentService.removeStep(id);
  }
}

