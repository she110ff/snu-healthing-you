import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Length,
  IsDateString,
  IsEnum,
  IsIn,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: '이메일 인증코드',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  verificationCode: string;

  @ApiProperty({
    description: '조직 코드 (SNU01 또는 SNU02)',
    example: 'SNU01',
    enum: ['SNU01', 'SNU02'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['SNU01', 'SNU02'])
  organizationCode: string;

  @ApiProperty({
    description: '생년월일',
    example: '1990-01-01',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({
    description: '성별',
    example: 'MALE',
    enum: ['MALE', 'FEMALE'],
  })
  @IsEnum(['MALE', 'FEMALE'])
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    description: '키 (cm)',
    example: 175.5,
  })
  @IsNumber()
  @Min(0)
  @Max(300)
  @IsNotEmpty()
  height: number;

  @ApiProperty({
    description: '몸무게 (kg)',
    example: 70.5,
  })
  @IsNumber()
  @Min(0)
  @Max(500)
  @IsNotEmpty()
  weight: number;

  @ApiProperty({
    description: '시도 코드 (Region code)',
    example: '11',
  })
  @IsString()
  @IsNotEmpty()
  sidoCode: string;

  @ApiProperty({
    description: '시군구 코드 (RegionDetail code)',
    example: '11680',
  })
  @IsString()
  @IsNotEmpty()
  guGunCode: string;
}
