import { Module } from '@nestjs/common';
import { DiseaseHistoryService } from './disease-history.service';
import { DiseaseHistoryController } from './disease-history.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DiseaseHistoryController],
  providers: [DiseaseHistoryService],
  exports: [DiseaseHistoryService],
})
export class DiseaseHistoryModule {}

