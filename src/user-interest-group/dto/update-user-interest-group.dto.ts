import { PartialType } from '@nestjs/swagger';
import { CreateUserInterestGroupDto } from './create-user-interest-group.dto';

export class UpdateUserInterestGroupDto extends PartialType(
  CreateUserInterestGroupDto,
) {}

