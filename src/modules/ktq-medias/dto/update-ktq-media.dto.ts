import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create.dto';

export class UpdateKtqMediaDto extends PartialType(CreateDto) {}
