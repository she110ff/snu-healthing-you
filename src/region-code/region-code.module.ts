import { Module } from '@nestjs/common';
import { RegionCodeController } from './region-code.controller';
import { RegionCodeService } from './region-code.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RegionCodeController],
  providers: [RegionCodeService],
  exports: [RegionCodeService],
})
export class RegionCodeModule {}

