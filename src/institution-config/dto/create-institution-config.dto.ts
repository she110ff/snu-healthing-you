import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEmail,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AffiliationCodeDto {
  @ApiProperty({
    description: '회원 코드',
    example: 'SNU01',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: '구분',
    example: '교원',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateInstitutionConfigDto {
  @ApiProperty({
    description: '기관명',
    example: '서울대학교',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '가입 메일 양식 (도메인)',
    example: 'snu.ac.kr',
  })
  @IsString()
  @IsNotEmpty()
  emailForm: string;

  @ApiProperty({
    description: '담당자명',
    example: '김서울',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactPersonName?: string;

  @ApiProperty({
    description: '담당자 연락처',
    example: '010-1234-5678',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactPersonPhone?: string;

  @ApiProperty({
    description: '담당자 이메일',
    example: 'doctorhealthingu@gmail.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  contactPersonEmail?: string;

  @ApiProperty({
    description: '사업자등록번호',
    example: '123-45-67890',
    required: false,
  })
  @IsString()
  @IsOptional()
  businessRegistrationNumber?: string;

  @ApiProperty({
    description: '최대 포인트',
    example: '1000000000',
  })
  @IsString()
  @IsNotEmpty()
  pointPoolTotal: string; // BigInt를 문자열로 받음

  @ApiProperty({
    description: '남은 포인트 (기본값: pointPoolTotal과 동일)',
    example: '1000000000',
    required: false,
  })
  @IsString()
  @IsOptional()
  pointPoolRemaining?: string; // BigInt를 문자열로 받음

  @ApiProperty({
    description: '개인별 월간 포인트 지급 한도',
    example: 25000,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  pointLimitPerUser: number;

  @ApiProperty({
    description: '회원 코드 목록',
    example: [
      { code: 'SNU01', name: '교원' },
      { code: 'SNU02', name: '교직원' },
    ],
    type: [AffiliationCodeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AffiliationCodeDto)
  @IsNotEmpty()
  affiliationCodes: AffiliationCodeDto[];
}

