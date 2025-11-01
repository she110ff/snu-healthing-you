import { ApiProperty } from '@nestjs/swagger';

export class ApproveUserResponseDto {
  @ApiProperty({
    description: '승인된 사용자 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '승인된 사용자 이메일',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: '승인된 사용자 이름',
    example: '홍길동',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: '이메일 인증 여부',
    example: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: '관리자 승인 여부',
    example: true,
  })
  approvedByAdmin: boolean;

  @ApiProperty({
    description: '승인 시간',
    example: '2025-10-30T14:29:00.000Z',
  })
  approvedAt: Date;

  @ApiProperty({
    description: '승인한 관리자/사용자 ID (관리자 승인 시 null)',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: false,
  })
  approvedById?: string | null;

  @ApiProperty({
    description: '생년월일',
    example: '1990-01-01',
    required: false,
  })
  dateOfBirth?: Date;

  @ApiProperty({
    description: '성별',
    example: 'MALE',
    required: false,
  })
  gender?: string;

  @ApiProperty({
    description: '키 (cm)',
    example: 175.5,
    required: false,
  })
  height?: number;

  @ApiProperty({
    description: '몸무게 (kg)',
    example: 70.5,
    required: false,
  })
  weight?: number;

  @ApiProperty({
    description: '시도',
    example: '서울특별시',
    required: false,
  })
  sido?: string;

  @ApiProperty({
    description: '구군',
    example: '강남구',
    required: false,
  })
  guGun?: string;

  @ApiProperty({
    description: '생성 시간',
    example: '2025-10-30T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 시간',
    example: '2025-10-30T14:29:00.000Z',
  })
  updatedAt: Date;
}


