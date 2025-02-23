import { IsUnique } from '@/system/validators/decorators/is-unique';
import {
  ArrayNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import KtqCategory from '../entities/ktq-category.entity';
import { HasExisted } from '@/system/validators/decorators/has-existed';
import { Optional } from '@nestjs/common';
import KtqTag from '../entities/ktq-tag.entity';

export default class UpdatePostDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  title: string;

  @Matches(
    /^(https?:\/\/)(localhost|\d{1,3}(\.\d{1,3}){3}|[\w.-]+)(:\d+)?(\/.*)?$/,
    {
      message: 'Invalid thumbnail',
    },
  )
  @IsOptional()
  thumbnail: string;

  @IsString()
  @MinLength(10)
  @IsOptional()
  preview_content: string;

  @IsString()
  @MinLength(10)
  @IsOptional()
  content: string;

  @HasExisted({ tableName: 'ktq_categories', column: 'id' })
  @IsOptional()
  category_id: KtqCategory['id'];

  @IsString()
  @IsOptional()
  slug: string;

  @IsNumber()
  @Optional()
  ttr: number;

  @IsNumber()
  @IsOptional()
  like_count: number;

  @IsOptional()
  tags: KtqTag[];
}
