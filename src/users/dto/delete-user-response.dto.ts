import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({
    description: '삭제된 사용자 ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '삭제된 사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '삭제된 사용자 이름',
    example: '홍길동',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: '삭제 시간',
    example: '2025-10-30T14:29:00.000Z',
  })
  deletedAt: Date;

  @ApiProperty({
    description: '삭제 성공 메시지',
    example: '사용자가 성공적으로 삭제되었습니다.',
  })
  message: string;
}

