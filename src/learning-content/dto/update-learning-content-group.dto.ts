import { PartialType } from '@nestjs/swagger';
import { CreateLearningContentGroupDto } from './create-learning-content-group.dto';

export class UpdateLearningContentGroupDto extends PartialType(
  CreateLearningContentGroupDto,
) {}

