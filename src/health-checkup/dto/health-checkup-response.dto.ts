import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckupResponseDto {
  @ApiProperty({
    description: '건강검진 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: '사용자 ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: '건강 검진일',
    example: '2024-01-15T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  checkupDate: Date | null;

  @ApiProperty({
    description: '체질량지수 (BMI)',
    example: 22.5,
    required: false,
    nullable: true,
  })
  bmi: number | null;

  @ApiProperty({
    description: '허리둘레 (cm)',
    example: 75.5,
    required: false,
    nullable: true,
  })
  waistCircumference: number | null;

  @ApiProperty({
    description: '수축기 혈압',
    example: 120,
    required: false,
    nullable: true,
  })
  systolicBloodPressure: number | null;

  @ApiProperty({
    description: '이완기 혈압',
    example: 80,
    required: false,
    nullable: true,
  })
  diastolicBloodPressure: number | null;

  @ApiProperty({
    description: '총 콜레스테롤 (mg/dL)',
    example: 200,
    required: false,
    nullable: true,
  })
  totalCholesterol: number | null;

  @ApiProperty({
    description: 'HDL 고밀도 지단백 (mg/dL)',
    example: 60,
    required: false,
    nullable: true,
  })
  hdlCholesterol: number | null;

  @ApiProperty({
    description: 'LDL 저밀도 지단백 (mg/dL)',
    example: 120,
    required: false,
    nullable: true,
  })
  ldlCholesterol: number | null;

  @ApiProperty({
    description: '중성지방 트리글리세라이드 (mg/dL)',
    example: 150,
    required: false,
    nullable: true,
  })
  triglycerides: number | null;

  @ApiProperty({
    description: '혈색소 (g/dL)',
    example: 14.5,
    required: false,
    nullable: true,
  })
  hemoglobin: number | null;

  @ApiProperty({
    description: 'AST (GOT)',
    example: 25,
    required: false,
    nullable: true,
  })
  ast: number | null;

  @ApiProperty({
    description: 'ALT (GPT)',
    example: 20,
    required: false,
    nullable: true,
  })
  alt: number | null;

  @ApiProperty({
    description: '혈청크레아티닌 (mg/dL)',
    example: 1.0,
    required: false,
    nullable: true,
  })
  serumCreatinine: number | null;

  @ApiProperty({
    description: '신사구체여과율 (mL/min)',
    example: 90.0,
    required: false,
    nullable: true,
  })
  glomerularFiltrationRate: number | null;

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

