import { IsUnique } from '@/system/validators/decorators/is-unique';
import { IsString, MinLength } from 'class-validator';

export default class CreateTagDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  @IsUnique({ tableName: 'ktq_tags', column: 'slug' })
  slug: string;
}
