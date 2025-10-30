import {
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateHealthCheckupDto {
  @ApiProperty({
    description: '건강 검진일',
    example: '2024-01-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  checkupDate?: string;

  @ApiProperty({
    description: '체질량지수 (BMI)',
    example: 22.5,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  bmi?: number;

  @ApiProperty({
    description: '허리둘레 (cm)',
    example: 75.5,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(300)
  @IsOptional()
  @Type(() => Number)
  waistCircumference?: number;

  @ApiProperty({
    description: '수축기 혈압',
    example: 120,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(300)
  @IsOptional()
  @Type(() => Number)
  systolicBloodPressure?: number;

  @ApiProperty({
    description: '이완기 혈압',
    example: 80,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(200)
  @IsOptional()
  @Type(() => Number)
  diastolicBloodPressure?: number;

  @ApiProperty({
    description: '총 콜레스테롤 (mg/dL)',
    example: 200,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(1000)
  @IsOptional()
  @Type(() => Number)
  totalCholesterol?: number;

  @ApiProperty({
    description: 'HDL 고밀도 지단백 (mg/dL) - 좋은 콜레스테롤',
    example: 60,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(300)
  @IsOptional()
  @Type(() => Number)
  hdlCholesterol?: number;

  @ApiProperty({
    description: 'LDL 저밀도 지단백 (mg/dL) - 나쁜 콜레스테롤',
    example: 120,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(1000)
  @IsOptional()
  @Type(() => Number)
  ldlCholesterol?: number;

  @ApiProperty({
    description: '중성지방 트리글리세라이드 (mg/dL)',
    example: 150,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(2000)
  @IsOptional()
  @Type(() => Number)
  triglycerides?: number;

  @ApiProperty({
    description: '혈색소 (g/dL)',
    example: 14.5,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(30)
  @IsOptional()
  @Type(() => Number)
  hemoglobin?: number;

  @ApiProperty({
    description: 'AST (GOT) - 간, 근육 등 손상 시 상승',
    example: 25,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(10000)
  @IsOptional()
  @Type(() => Number)
  ast?: number;

  @ApiProperty({
    description: 'ALT (GPT) - 간 손상 시 상승',
    example: 20,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(10000)
  @IsOptional()
  @Type(() => Number)
  alt?: number;

  @ApiProperty({
    description: '혈청크레아티닌 (mg/dL) - 신장 기능 저하 시 상승',
    example: 1.0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  serumCreatinine?: number;

  @ApiProperty({
    description: '신사구체여과율 (mL/min) - GFR, 신장 기능 저하 시 저하',
    example: 90.0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(200)
  @IsOptional()
  @Type(() => Number)
  glomerularFiltrationRate?: number;
}

