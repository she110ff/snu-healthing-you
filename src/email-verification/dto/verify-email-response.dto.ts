import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({
    description: '인증 성공 여부',
    example: true,
  })
  verified: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '이메일 인증이 완료되었습니다.',
  })
  message: string;
}

