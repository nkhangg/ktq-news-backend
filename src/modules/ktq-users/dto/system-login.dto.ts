import { HasExisted } from '@/system/validators/decorators/has-existed';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { KtqUser } from '../entities/ktq-user.entity';

export class SystemLoginDto {
  @IsEmail()
  @HasExisted({ tableName: KtqUser.table_name, column: 'email' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
