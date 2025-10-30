import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationCodeResponseDto {
  @ApiProperty({
    description: '발급된 인증코드 (개발/테스트용)',
    example: '123456',
  })
  code: string;

  @ApiProperty({
    description: '인증코드 만료 시간',
    example: '2025-10-30T15:40:00.000Z',
  })
  expiresAt: Date;

  @ApiProperty({
    description: '응답 메시지',
    example: '인증코드가 발급되었습니다.',
  })
  message: string;
}

