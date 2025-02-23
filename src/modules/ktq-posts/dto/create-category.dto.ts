import { IsUnique } from '@/system/validators/decorators/is-unique';
import { IsString, MinLength } from 'class-validator';

export default class CreateCategoryDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  @IsUnique({ tableName: 'ktq_categories', column: 'slug' })
  slug: string;

  @IsString()
  @MinLength(4)
  description: string;
}
