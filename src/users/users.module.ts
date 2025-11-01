import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailVerificationModule } from '../email-verification/email-verification.module';
import { OrganizationVerificationModule } from '../organization-verification/organization-verification.module';

@Module({
  imports: [
    PrismaModule,
    EmailVerificationModule,
    OrganizationVerificationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
