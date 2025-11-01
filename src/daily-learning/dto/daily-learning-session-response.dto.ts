import { ApiProperty } from '@nestjs/swagger';

export class DailyLearningSessionResponseDto {
  @ApiProperty({
    description: '세션 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: '사용자 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: '학습 컨텐츠 그룹 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  learningContentGroupId: string;

  @ApiProperty({
    description: '세션 날짜',
    example: '2024-01-15T00:00:00.000Z',
  })
  sessionDate: Date;

  @ApiProperty({
    description: '오늘 완료한 Topic 수',
    example: 2,
  })
  topicsCompleted: number;

  @ApiProperty({
    description: '오늘 완료한 Content 수',
    example: 5,
  })
  contentsCompleted: number;

  @ApiProperty({
    description: '오늘 완료한 Step 수',
    example: 10,
  })
  stepsCompleted: number;

  @ApiProperty({
    description: '마지막 학습 시간',
    example: '2024-01-15T14:30:00.000Z',
  })
  lastLearningAt: Date;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;
}

