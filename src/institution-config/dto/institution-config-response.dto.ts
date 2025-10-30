import { ApiProperty } from '@nestjs/swagger';

export class InstitutionConfigResponseDto {
  @ApiProperty({
    description: '기관 설정 ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '기관명',
    example: '서울대학교',
  })
  name: string;

  @ApiProperty({
    description: '가입 메일 양식',
    example: 'snu.ac.kr',
  })
  emailForm: string;

  @ApiProperty({
    description: '담당자명',
    example: '김서울',
    required: false,
  })
  contactPersonName?: string | null;

  @ApiProperty({
    description: '담당자 연락처',
    example: '010-1234-5678',
    required: false,
  })
  contactPersonPhone?: string | null;

  @ApiProperty({
    description: '담당자 이메일',
    example: 'doctorhealthingu@gmail.com',
    required: false,
  })
  contactPersonEmail?: string | null;

  @ApiProperty({
    description: '사업자등록번호',
    example: '123-45-67890',
    required: false,
  })
  businessRegistrationNumber?: string | null;

  @ApiProperty({
    description: '최대 포인트',
    example: '1000000000',
  })
  pointPoolTotal: string; // BigInt를 문자열로 반환

  @ApiProperty({
    description: '남은 포인트',
    example: '1000000000',
  })
  pointPoolRemaining: string; // BigInt를 문자열로 반환

  @ApiProperty({
    description: '개인별 월간 포인트 지급 한도',
    example: 25000,
  })
  pointLimitPerUser: number;

  @ApiProperty({
    description: '회원 코드 목록',
    example: [
      { code: 'SNU01', name: '교원' },
      { code: 'SNU02', name: '교직원' },
    ],
  })
  affiliationCodes: any; // JSON 타입
}

