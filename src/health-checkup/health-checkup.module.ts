import { Module } from '@nestjs/common';
import { HealthCheckupService } from './health-checkup.service';
import { HealthCheckupController } from './health-checkup.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HealthCheckupController],
  providers: [HealthCheckupService],
  exports: [HealthCheckupService],
})
export class HealthCheckupModule {}

