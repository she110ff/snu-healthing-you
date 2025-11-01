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
    description: '시도 코드 (Region code)',
    example: '11',
    required: false,
  })
  @IsString()
  @IsOptional()
  sidoCode?: string;

  @ApiProperty({
    description: '시군구 코드 (RegionDetail code)',
    example: '11680',
    required: false,
  })
  @IsString()
  @IsOptional()
  guGunCode?: string;
}
