import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({
    description: '주제 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  topicId: string;

  @ApiProperty({
    description: '컨텐츠 제목',
    example: '당뇨란 무엇인가',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '순서',
    example: 1,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  order: number;
}

