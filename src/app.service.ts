import { Injectable } from '@nestjs/common';
import { HealthCheckDto } from './common/dto/health.dto';

@Injectable()
export class AppService {
  getHello(): HealthCheckDto {
    return {
      message: 'Hello World!',
      timestamp: new Date().toISOString(),
    };
  }
}
