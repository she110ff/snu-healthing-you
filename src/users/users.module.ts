import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailVerificationModule } from '../email-verification/email-verification.module';
import { OrganizationVerificationModule } from '../organization-verification/organization-verification.module';
import { AuthModule } from '../auth/auth.module';
import { RegionCodeModule } from '../region-code/region-code.module';

@Module({
  imports: [
    PrismaModule,
    EmailVerificationModule,
    OrganizationVerificationModule,
    AuthModule,
    RegionCodeModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
