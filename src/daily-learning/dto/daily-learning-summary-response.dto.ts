import { ApiProperty } from '@nestjs/swagger';
import { LearningContentGroupResponseDto } from '../../learning-content/dto/learning-content-group-response.dto';
import { LearningProgressResponseDto } from './learning-progress-response.dto';
import { DailyLearningSessionResponseDto } from './daily-learning-session-response.dto';

export class DailyLearningSummaryResponseDto {
  @ApiProperty({
    description: '선택된 학습 컨텐츠 그룹',
    type: LearningContentGroupResponseDto,
  })
  selectedGroup: LearningContentGroupResponseDto;

  @ApiProperty({
    description: '현재 진행 상태',
    type: LearningProgressResponseDto,
  })
  currentProgress: LearningProgressResponseDto;

  @ApiProperty({
    description: '오늘의 학습 세션',
    type: DailyLearningSessionResponseDto,
    required: false,
  })
  todaySession?: DailyLearningSessionResponseDto;

  @ApiProperty({
    description: '전체 Topic 수',
    example: 10,
  })
  totalTopics: number;

  @ApiProperty({
    description: '전체 Content 수',
    example: 30,
  })
  totalContents: number;

  @ApiProperty({
    description: '전체 Step 수',
    example: 100,
  })
  totalSteps: number;

  @ApiProperty({
    description: '완료한 Topic 수',
    example: 3,
  })
  topicsCompleted: number;

  @ApiProperty({
    description: '완료한 Content 수',
    example: 10,
  })
  contentsCompleted: number;

  @ApiProperty({
    description: '완료한 Step 수',
    example: 35,
  })
  stepsCompleted: number;

  @ApiProperty({
    description: '오늘 완료한 Topic 수',
    example: 1,
  })
  todayTopicsCompleted: number;

  @ApiProperty({
    description: '오늘 완료한 Content 수',
    example: 2,
  })
  todayContentsCompleted: number;

  @ApiProperty({
    description: '오늘 완료한 Step 수',
    example: 5,
  })
  todayStepsCompleted: number;

  @ApiProperty({
    description: '전체 진행률 (0-100)',
    example: 35.0,
  })
  overallProgressPercentage: number;

  @ApiProperty({
    description: '오늘의 진행률 (0-100)',
    example: 5.0,
  })
  todayProgressPercentage: number;
}

