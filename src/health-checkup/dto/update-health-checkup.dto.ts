import { PartialType } from '@nestjs/swagger';
import { CreateHealthCheckupDto } from './create-health-checkup.dto';

export class UpdateHealthCheckupDto extends PartialType(
  CreateHealthCheckupDto,
) {}

