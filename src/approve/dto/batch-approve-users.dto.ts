import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchApproveUsersDto {
  @ApiProperty({
    description: '승인할 사용자 ID 배열 (UUID)',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty({ message: '최소 하나 이상의 사용자 ID가 필요합니다.' })
  @IsUUID('4', { each: true, message: '모든 ID는 유효한 UUID 형식이어야 합니다.' })
  ids: string[];
}




