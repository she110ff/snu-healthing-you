import { IsString, IsNotEmpty, IsInt, Min, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateStepContentItemDto } from './create-step-content-item.dto';

export class CreateStepDto {
  @ApiProperty({
    description: '컨텐츠 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  contentId: string;

  @ApiProperty({
    description: '페이지 제목',
    example: '당뇨의 정의',
  })
  @IsString()
  @IsNotEmpty()
  pageTitle: string;

  @ApiProperty({
    description: '순서',
    example: 1,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  order: number;

  @ApiProperty({
    description: '컨텐츠 아이템 목록',
    type: [CreateStepContentItemDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepContentItemDto)
  @IsNotEmpty()
  contentItems: CreateStepContentItemDto[];
}

