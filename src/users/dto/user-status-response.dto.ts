import { ApiProperty } from '@nestjs/swagger';

export class UserStatusResponseDto {
  @ApiProperty({
    description: '사용자 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '이메일 인증 완료 여부',
    example: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: '관리자 승인 여부',
    example: false,
  })
  approvedByAdmin: boolean;

  @ApiProperty({
    description: '관리자 승인 시간',
    example: '2025-10-30T14:29:00.000Z',
    required: false,
  })
  approvedAt?: Date;

  @ApiProperty({
    description: '승인한 관리자 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  approvedById?: string;
}

