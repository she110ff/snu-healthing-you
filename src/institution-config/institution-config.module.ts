import { Module } from '@nestjs/common';
import { InstitutionConfigService } from './institution-config.service';
import { AdminInstitutionConfigController } from './institution-config.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AdminInstitutionConfigController],
  providers: [InstitutionConfigService],
  exports: [InstitutionConfigService],
})
export class InstitutionConfigModule {}

