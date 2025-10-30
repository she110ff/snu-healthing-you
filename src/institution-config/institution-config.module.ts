import { Module } from '@nestjs/common';
import { InstitutionConfigService } from './institution-config.service';
import { AdminInstitutionConfigController } from './institution-config.controller';

@Module({
  controllers: [AdminInstitutionConfigController],
  providers: [InstitutionConfigService],
  exports: [InstitutionConfigService],
})
export class InstitutionConfigModule {}

