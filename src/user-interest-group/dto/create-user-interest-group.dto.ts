import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInterestGroupDto {
  @ApiProperty({
    description: '학습 컨텐츠 그룹 ID (LearningContentGroup ID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: true,
  })
  @IsString()
  @IsUUID()
  learningContentGroupId: string;
}

