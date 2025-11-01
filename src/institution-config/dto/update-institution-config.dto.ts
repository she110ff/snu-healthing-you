import { IsString, IsInt, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInstitutionConfigDto {
  @ApiProperty({
    description: '기관명',
    example: '서울대학교',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: '최대 포인트',
    example: '1000000000',
    required: false,
  })
  @IsString()
  @IsOptional()
  pointPoolTotal?: string; // BigInt를 문자열로 받음

  @ApiProperty({
    description: '개인별 월간 포인트 지급 한도',
    example: 25000,
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  pointLimitPerUser?: number;
}
