import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({
    description: '관리자 이름',
    example: '관리자',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '관리자 비밀번호',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

