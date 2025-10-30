import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInterestGroupDto {
  @ApiProperty({
    description: '관심 그룹 (단일 선택)',
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
    required: true,
  })
  @IsString()
  @IsIn([
    'GENERAL',
    'CANCER_RECOVERY',
    'DIABETES_MANAGEMENT',
    'DIABETES_HIGH_RISK',
    'HYPERTENSION_MANAGEMENT',
    'HYPERTENSION_HIGH_RISK',
    'DYSLIPIDEMIA_MANAGEMENT',
    'DYSLIPIDEMIA_HIGH_RISK',
  ])
  group: string;
}

