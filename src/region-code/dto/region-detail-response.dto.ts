import { ApiProperty } from '@nestjs/swagger';

export class RegionDetailResponseDto {
  @ApiProperty({
    description: '시군구 코드 (RR_SQ2)',
    example: '11000',
  })
  code: string;

  @ApiProperty({
    description: '시군구 이름',
    example: '서울특별시',
  })
  name: string;

  @ApiProperty({
    description: '시도 코드 (SQ1)',
    example: '11',
    required: false,
  })
  regionCode?: string;

  @ApiProperty({
    description: '시도 이름',
    example: '서울',
    required: false,
  })
  regionName?: string;
}

