import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PermissionDto } from './permission.dto';
import { HasExisted } from '@/system/validators/decorators/has-existed';

export class UpdateDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  fullname: string;

  @IsOptional()
  @IsArray()
  permissions: PermissionDto[];
}
