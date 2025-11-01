import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SelectGroupDto {
  @ApiProperty({
    description: '학습 컨텐츠 그룹 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  learningContentGroupId: string;
}

