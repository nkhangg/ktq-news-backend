import { IsUnique } from '@/system/validators/decorators/is-unique';
import { IsEnum, IsString, MinLength, Validate } from 'class-validator';
import { ConfigValueType } from '../entities/ktq-config.entity';
import { IsConfigValue } from '@/system/validators/is-config-value';

export class CreateDto {
  @IsString()
  @IsUnique({ tableName: 'ktq_configs', column: 'key_name' })
  key_name: string;

  @IsString()
  @Validate(IsConfigValue)
  value: string;

  @IsEnum(ConfigValueType)
  type: ConfigValueType;
}
