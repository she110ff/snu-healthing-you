import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InstitutionConfigModule } from './institution-config/institution-config.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { OrganizationVerificationModule } from './organization-verification/organization-verification.module';
import { HealthCheckupModule } from './health-checkup/health-checkup.module';
import { DiseaseHistoryModule } from './disease-history/disease-history.module';
import { InterestGroupModule } from './interest-group/interest-group.module';
import { ApproveModule } from './approve/approve.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    InstitutionConfigModule,
    EmailVerificationModule,
    OrganizationVerificationModule,
    HealthCheckupModule,
    DiseaseHistoryModule,
    InterestGroupModule,
    ApproveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
