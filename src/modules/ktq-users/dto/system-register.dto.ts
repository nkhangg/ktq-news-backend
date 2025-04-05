import { HasExisted } from '@/system/validators/decorators/has-existed';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { KtqUser } from '../entities/ktq-user.entity';
import { IsUnique } from '@/system/validators/decorators/is-unique';

export class SystemRegisterDto {
  @IsEmail()
  @IsUnique({ tableName: KtqUser.table_name, column: 'email' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(4)
  name: string;
}
