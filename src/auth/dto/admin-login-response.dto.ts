import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginResponseDto {
  @ApiProperty({
    description: 'JWT 액세스 토큰',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJuYW1lIjoi7YWM66as7Iqk7Yq4Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE2MTYyNDI2MjJ9',
  })
  accessToken: string;

  @ApiProperty({
    description: '관리자 정보',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: '관리자',
      role: 'ADMIN',
    },
  })
  admin: {
    id: string;
    name: string;
    role: string;
  };
}

