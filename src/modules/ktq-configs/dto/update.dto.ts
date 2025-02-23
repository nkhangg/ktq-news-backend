import { IsUnique } from '@/system/validators/decorators/is-unique';
import { IsConfigValue } from '@/system/validators/is-config-value';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { ConfigValueType } from '../entities/ktq-config.entity';

export class UpdateDto {
  @IsString()
  @Validate(IsConfigValue)
  @IsOptional()
  value: string;

  @IsEnum(ConfigValueType)
  @IsOptional()
  type: ConfigValueType;
}
