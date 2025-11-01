import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLearningContentGroupDto {
  @ApiProperty({
    description: '그룹명',
    example: '당뇨 관리 그룹',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '설명',
    example: '당뇨 관리를 위한 학습 컨텐츠 그룹',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

