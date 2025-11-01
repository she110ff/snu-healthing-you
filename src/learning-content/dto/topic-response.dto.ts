import { ApiProperty } from '@nestjs/swagger';

export class TopicResponseDto {
  @ApiProperty({
    description: '주제 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: '학습 컨텐츠 그룹 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  learningContentGroupId: string;

  @ApiProperty({
    description: '주제 제목',
    example: '당뇨의 이해',
  })
  title: string;

  @ApiProperty({
    description: '설명',
    example: '당뇨병에 대한 기본적인 이해를 돕는 주제',
    required: false,
  })
  description?: string | null;

  @ApiProperty({
    description: '순서',
    example: 1,
  })
  order: number;

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

  @ApiProperty({
    description: '삭제일시',
    example: null,
    required: false,
  })
  deletedAt?: Date | null;
}

