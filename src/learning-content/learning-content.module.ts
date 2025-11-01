import { Module } from '@nestjs/common';
import { LearningContentController } from './learning-content.controller';
import { LearningContentService } from './learning-content.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LearningContentController],
  providers: [LearningContentService],
  exports: [LearningContentService],
})
export class LearningContentModule {}

