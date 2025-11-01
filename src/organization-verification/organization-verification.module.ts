import { Module } from '@nestjs/common';
import { OrganizationVerificationController } from './organization-verification.controller';
import { OrganizationVerificationService } from './organization-verification.service';

@Module({
  controllers: [OrganizationVerificationController],
  providers: [OrganizationVerificationService],
  exports: [OrganizationVerificationService],
})
export class OrganizationVerificationModule {}

