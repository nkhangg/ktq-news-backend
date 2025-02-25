import { PartialType } from '@nestjs/mapped-types';
import { CreateKtqDashboardDto } from './create-ktq-dashboard.dto';

export class UpdateKtqDashboardDto extends PartialType(CreateKtqDashboardDto) {}
