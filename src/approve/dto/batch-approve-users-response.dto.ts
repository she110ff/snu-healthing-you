import { ApiProperty } from '@nestjs/swagger';

export class ApprovedUserResult {
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
    description: '승인 시간',
    example: '2025-10-30T14:29:00.000Z',
  })
  approvedAt: Date;
}

export class FailedUserResult {
  @ApiProperty({
    description: '승인 실패한 사용자 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '에러 메시지',
    example: '이미 승인된 사용자입니다.',
  })
  error: string;
}

export class BatchApproveUsersResponseDto {
  @ApiProperty({
    description: '성공적으로 승인된 사용자 목록',
    type: [ApprovedUserResult],
  })
  success: ApprovedUserResult[];

  @ApiProperty({
    description: '승인에 실패한 사용자 목록',
    type: [FailedUserResult],
  })
  failed: FailedUserResult[];

  @ApiProperty({
    description: '처리 결과 요약',
    example: {
      total: 5,
      successCount: 3,
      failedCount: 2,
    },
  })
  summary: {
    total: number;
    successCount: number;
    failedCount: number;
  };
}


