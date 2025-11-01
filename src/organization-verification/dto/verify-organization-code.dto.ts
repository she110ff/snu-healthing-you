import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOrganizationCodeDto {
  @ApiProperty({
    description: '조직 코드 (SNU01 또는 SNU02)',
    example: 'SNU01',
    enum: ['SNU01', 'SNU02'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['SNU01', 'SNU02'])
  organizationCode: string;
}

