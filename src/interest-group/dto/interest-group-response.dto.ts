import { ApiProperty } from '@nestjs/swagger';

export class InterestGroupResponseDto {
  @ApiProperty({
    description: '관심 그룹 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: '사용자 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: '관심 그룹',
    example: 'GENERAL',
    enum: [
      'GENERAL',
      'CANCER_RECOVERY',
      'DIABETES_MANAGEMENT',
      'DIABETES_HIGH_RISK',
      'HYPERTENSION_MANAGEMENT',
      'HYPERTENSION_HIGH_RISK',
      'DYSLIPIDEMIA_MANAGEMENT',
      'DYSLIPIDEMIA_HIGH_RISK',
    ],
  })
  group: string;

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

