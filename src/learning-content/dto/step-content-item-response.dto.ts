import { ApiProperty } from '@nestjs/swagger';
import { ContentItemType } from '@prisma/client';

export class StepContentItemResponseDto {
  @ApiProperty({
    description: '아이템 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: '스텝 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  stepId: string;

  @ApiProperty({
    description: '컨텐츠 타입',
    enum: ContentItemType,
    example: ContentItemType.TEXT,
  })
  type: ContentItemType;

  @ApiProperty({
    description: '순서',
    example: 1,
  })
  order: number;

  @ApiProperty({
    description: '타입별 데이터 (JSON)',
    example: { text: '일반 텍스트 내용' },
  })
  data: Record<string, any>;

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

