import { ApiProperty } from '@nestjs/swagger';

export class RegionResponseDto {
  @ApiProperty({
    description: '시도 코드 (SQ1)',
    example: '11',
  })
  code: string;

  @ApiProperty({
    description: '시도 이름',
    example: '서울',
  })
  name: string;
}

