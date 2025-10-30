import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckDto {
  @ApiProperty({
    description: '서버 상태 메시지',
    example: 'Hello World!',
  })
  message: string;

  @ApiProperty({
    description: '서버 타임스탬프',
    example: '2024-01-01T00:00:00.000Z',
  })
  timestamp: string;
}
