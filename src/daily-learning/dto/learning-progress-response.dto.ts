import { ApiProperty } from '@nestjs/swagger';

export class LearningProgressResponseDto {
  @ApiProperty({
    description: '진행 상태 ID',
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
    description: '현재 진행 중인 Topic ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    nullable: true,
  })
  currentTopicId?: string | null;

  @ApiProperty({
    description: '현재 진행 중인 Content ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    nullable: true,
  })
  currentContentId?: string | null;

  @ApiProperty({
    description: '현재 진행 중인 Step ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    nullable: true,
  })
  currentStepId?: string | null;

  @ApiProperty({
    description: '완료 여부',
    example: false,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: '완료 시간',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  completedAt?: Date | null;

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

