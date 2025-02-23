import { HasExisted } from '@/system/validators/decorators/has-existed';
import { IsNumber } from 'class-validator';
import KtqPost from '../entities/ktq-post.entity';
import { Optional } from '@nestjs/common';

export default class CreateSearchHistoryDto {
  @IsNumber()
  @HasExisted({ tableName: 'ktq_posts', column: 'id' })
  post_id: KtqPost['id'];

  @IsNumber()
  @Optional()
  search_count: number;
}
