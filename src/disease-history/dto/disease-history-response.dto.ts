import { ApiProperty } from '@nestjs/swagger';

export class DiseaseHistoryResponseDto {
  @ApiProperty({
    description: '질환 이력 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: '사용자 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: '만성질환 질환명',
    example: ['이상지질혈증', '고혈압'],
    type: [String],
  })
  chronicDiseases: string[];

  @ApiProperty({
    description: '만성 호흡기 질환명',
    example: ['만성폐쇄성 폐질환', '기관지 천식'],
    type: [String],
  })
  chronicRespiratoryDiseases: string[];

  @ApiProperty({
    description: '만성 호흡기 질환 기타',
    example: '기타 호흡기 질환',
    nullable: true,
  })
  chronicRespiratoryOther: string | null;

  @ApiProperty({
    description: '만성 관절염',
    example: ['류마티스 관절염', '통풍'],
    type: [String],
  })
  chronicArthritis: string[];

  @ApiProperty({
    description: '골관절염 (고관절, 무릎, 손)',
    example: '무릎, 손',
    nullable: true,
  })
  osteoarthritis: string | null;

  @ApiProperty({
    description: '만성 관절염 기타',
    example: '기타 관절염',
    nullable: true,
  })
  chronicArthritisOther: string | null;

  @ApiProperty({
    description: '타질환 과거력 - 만성질환',
    example: ['심장질환', '간 질환'],
    type: [String],
  })
  pastChronicDiseases: string[];

  @ApiProperty({
    description: '5년 내 암 과거력',
    example: ['유방암', '대장암'],
    type: [String],
  })
  cancerHistory: string[];

  @ApiProperty({
    description: '암 과거력 기타',
    example: '기타 암',
    nullable: true,
  })
  cancerOther: string | null;

  @ApiProperty({
    description: '현재 흡연 여부',
    example: 'NO',
  })
  isSmoking: string | null;

  @ApiProperty({
    description: '현재 음주 여부',
    example: 'NO',
  })
  isDrinking: string | null;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-15T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-15T00:00:00.000Z',
  })
  updatedAt: Date;
}

