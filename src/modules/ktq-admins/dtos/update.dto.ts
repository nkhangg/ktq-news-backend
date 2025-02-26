import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { PermissionDto } from './permission.dto';

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
