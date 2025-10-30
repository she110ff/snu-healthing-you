import { PartialType } from '@nestjs/swagger';
import { CreateDiseaseHistoryDto } from './create-disease-history.dto';

export class UpdateDiseaseHistoryDto extends PartialType(
  CreateDiseaseHistoryDto,
) {}

