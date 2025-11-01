import { Module } from '@nestjs/common';
import { ApproveService } from './approve.service';
import { ApproveController } from './approve.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ApproveController],
  providers: [ApproveService],
  exports: [ApproveService],
})
export class ApproveModule {}

