import { PartialType } from '@nestjs/mapped-types';
import { CreateKtqUserDto } from './create-ktq-user.dto';

export class UpdateKtqUserDto extends PartialType(CreateKtqUserDto) {}
