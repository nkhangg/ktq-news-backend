import { IsString, MinLength } from 'class-validator';

export class GrantNewPasswordDto {
  @IsString()
  @MinLength(6)
  password: string;
}
