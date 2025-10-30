import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InstitutionConfigModule } from './institution-config/institution-config.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
