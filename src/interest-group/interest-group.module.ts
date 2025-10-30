import { Module } from '@nestjs/common';
import { InterestGroupService } from './interest-group.service';
import { InterestGroupController } from './interest-group.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InterestGroupController],
  providers: [InterestGroupService],
  exports: [InterestGroupService],
})
export class InterestGroupModule {}

