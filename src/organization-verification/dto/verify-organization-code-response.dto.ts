import { ApiProperty } from '@nestjs/swagger';

export class VerifyOrganizationCodeResponseDto {
  @ApiProperty({
    description: '검증 성공 여부',
    example: true,
  })
  verified: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '조직 코드 검증이 완료되었습니다.',
  })
  message: string;
}

