import { IsUnique } from '@/system/validators/decorators/is-unique';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsOptional()
  fullname: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  message: string;
}
