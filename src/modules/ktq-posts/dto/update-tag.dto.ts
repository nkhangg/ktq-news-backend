import { IsOptional, IsString, MinLength } from 'class-validator';

export default class UpdateTagDto {
  @IsString()
  @MinLength(4)
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  slug: string;
}
