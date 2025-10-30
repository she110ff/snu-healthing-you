import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthCheckDto } from './common/dto/health.dto';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '헬스 체크', description: '서버 상태를 확인합니다.' })
  @ApiResponse({ 
    status: 200, 
    description: '서버가 정상 작동 중입니다.',
    type: HealthCheckDto,
  })
  getHello(): HealthCheckDto {
    return this.appService.getHello();
  }
}
