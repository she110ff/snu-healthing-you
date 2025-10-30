import { PartialType } from '@nestjs/swagger';
import { CreateInterestGroupDto } from './create-interest-group.dto';

export class UpdateInterestGroupDto extends PartialType(
  CreateInterestGroupDto,
) {}

