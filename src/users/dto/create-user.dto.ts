import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Length, IsDateString, IsEnum, IsNumber, Min, Max } from 'class-validator';
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
    description: '생년월일',
    example: '1990-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({
    description: '성별',
    example: 'MALE',
    enum: ['MALE', 'FEMALE'],
    required: false,
  })
  @IsEnum(['MALE', 'FEMALE'])
  @IsOptional()
  gender?: string;

  @ApiProperty({
    description: '키 (cm)',
    example: 175.5,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(300)
  @IsOptional()
  height?: number;

  @ApiProperty({
    description: '몸무게 (kg)',
    example: 70.5,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(500)
  @IsOptional()
  weight?: number;

  @ApiProperty({
    description: '시도',
    example: '서울특별시',
    required: false,
  })
  @IsString()
  @IsOptional()
  sido?: string;

  @ApiProperty({
    description: '구군',
    example: '강남구',
    required: false,
  })
  @IsString()
  @IsOptional()
  guGun?: string;
}
