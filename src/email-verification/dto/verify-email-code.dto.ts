import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailCodeDto {
  @ApiProperty({
    description: '인증할 이메일 주소',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '인증코드',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}

