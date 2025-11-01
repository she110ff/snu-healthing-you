import { ApiProperty } from '@nestjs/swagger';
import { LearningProgressResponseDto } from './learning-progress-response.dto';
import { DailyLearningSessionResponseDto } from './daily-learning-session-response.dto';
import { TopicResponseDto } from '../../learning-content/dto/topic-response.dto';
import { ContentResponseDto } from '../../learning-content/dto/content-response.dto';
import { StepResponseDto } from '../../learning-content/dto/step-response.dto';

export class CurrentLearningContentResponseDto {
  @ApiProperty({
    description: '학습 진행 상태',
    type: LearningProgressResponseDto,
  })
  progress: LearningProgressResponseDto;

  @ApiProperty({
    description: '오늘의 학습 세션',
    type: DailyLearningSessionResponseDto,
    required: false,
  })
  currentSession?: DailyLearningSessionResponseDto;

  @ApiProperty({
    description: '현재 Topic 정보',
    type: TopicResponseDto,
    required: false,
    nullable: true,
  })
  currentTopic?: TopicResponseDto | null;

  @ApiProperty({
    description: '현재 Content 정보',
    type: ContentResponseDto,
    required: false,
    nullable: true,
  })
  currentContent?: ContentResponseDto | null;

  @ApiProperty({
    description: '현재 Step 정보',
    type: StepResponseDto,
    required: false,
    nullable: true,
  })
  currentStep?: StepResponseDto | null;

  @ApiProperty({
    description: '다음 Step 정보',
    type: StepResponseDto,
    required: false,
    nullable: true,
  })
  nextStep?: StepResponseDto | null;

  @ApiProperty({
    description: '전체 진행률 (0-100)',
    example: 45.5,
  })
  progressPercentage: number;

  @ApiProperty({
    description: '오늘의 진행률 (0-100)',
    example: 12.5,
    required: false,
  })
  todayProgressPercentage?: number;
}

