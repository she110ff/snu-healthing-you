import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({
    description: '학습 컨텐츠 그룹 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  learningContentGroupId: string;

  @ApiProperty({
    description: '주제 제목',
    example: '당뇨의 이해',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '설명',
    example: '당뇨병에 대한 기본적인 이해를 돕는 주제',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: '순서',
    example: 1,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  order: number;
}

