import {
  IsOptional,
  IsDateString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
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
