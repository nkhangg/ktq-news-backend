import { IsUnique } from '@/system/validators/decorators/is-unique';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsEmail()
  @IsUnique({ tableName: 'ktq_admins', column: 'email' })
  email: string;

  @IsString()
  fullname: string;

  @IsString()
  @IsUnique({ tableName: 'ktq_admins', column: 'username' })
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}
