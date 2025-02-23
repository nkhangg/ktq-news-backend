import { IsUnique } from '@/system/validators/decorators/is-unique';
import { IsOptional, IsString, MinLength } from 'class-validator';

export default class UpdateCategoryDto {
  @IsString()
  @MinLength(4)
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  description: string;
}
