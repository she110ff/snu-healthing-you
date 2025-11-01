import { Module } from '@nestjs/common';
import { UserInterestGroupService } from './user-interest-group.service';
import { UserInterestGroupController } from './user-interest-group.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserInterestGroupController],
  providers: [UserInterestGroupService],
  exports: [UserInterestGroupService],
})
export class UserInterestGroupModule {}

