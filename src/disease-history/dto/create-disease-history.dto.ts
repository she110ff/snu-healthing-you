import {
  IsOptional,
  IsArray,
  IsString,
  IsIn,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiseaseHistoryDto {
  @ApiProperty({
    description: '만성질환 질환명 (다중 선택 가능)',
    example: ['이상지질혈증', '고혈압'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chronicDiseases?: string[];

  @ApiProperty({
    description: '만성 호흡기 질환명 (다중 선택 가능)',
    example: ['만성폐쇄성 폐질환', '기관지 천식'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chronicRespiratoryDiseases?: string[];

  @ApiProperty({
    description: '만성 호흡기 질환 기타',
    example: '기타 호흡기 질환',
    required: false,
  })
  @IsString()
  @IsOptional()
  chronicRespiratoryOther?: string;

  @ApiProperty({
    description: '만성 관절염 (다중 선택 가능)',
    example: ['류마티스 관절염', '통풍'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chronicArthritis?: string[];

  @ApiProperty({
    description: '골관절염 (고관절, 무릎, 손)',
    example: '무릎, 손',
    required: false,
  })
  @IsString()
  @IsOptional()
  osteoarthritis?: string;

  @ApiProperty({
    description: '만성 관절염 기타',
    example: '기타 관절염',
    required: false,
  })
  @IsString()
  @IsOptional()
  chronicArthritisOther?: string;

  @ApiProperty({
    description: '타질환 과거력 - 만성질환 (다중 선택 가능)',
    example: ['심장질환', '간 질환'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  pastChronicDiseases?: string[];

  @ApiProperty({
    description: '5년 내 암 과거력 (다중 선택 가능)',
    example: ['유방암', '대장암'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cancerHistory?: string[];

  @ApiProperty({
    description: '암 과거력 기타',
    example: '기타 암',
    required: false,
  })
  @IsString()
  @IsOptional()
  cancerOther?: string;

  @ApiProperty({
    description: '현재 흡연 여부',
    example: 'NO',
    enum: ['YES', 'NO'],
    required: true,
  })
  @IsString()
  @IsIn(['YES', 'NO'])
  isSmoking: string;

  @ApiProperty({
    description: '현재 음주 여부',
    example: 'NO',
    enum: ['YES', 'NO'],
    required: true,
  })
  @IsString()
  @IsIn(['YES', 'NO'])
  isDrinking: string;
}

