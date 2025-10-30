import { Module } from '@nestjs/common';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerificationService } from './email-verification.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}

