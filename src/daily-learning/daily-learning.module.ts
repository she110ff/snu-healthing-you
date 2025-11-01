import { Module } from '@nestjs/common';
import { DailyLearningService } from './daily-learning.service';
import { DailyLearningController } from './daily-learning.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserInterestGroupModule } from '../user-interest-group/user-interest-group.module';
import { LearningContentModule } from '../learning-content/learning-content.module';

@Module({
  imports: [
    PrismaModule,
    UserInterestGroupModule,
    LearningContentModule,
  ],
  controllers: [DailyLearningController],
  providers: [DailyLearningService],
  exports: [DailyLearningService],
})
export class DailyLearningModule {}

