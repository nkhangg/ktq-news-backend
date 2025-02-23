import { HasExisted } from '@/system/validators/decorators/has-existed';
import { IsNumber } from 'class-validator';
import KtqPost from '../entities/ktq-post.entity';

export default class ToggleLikeDto {
  @IsNumber()
  @HasExisted({ tableName: 'ktq_posts', column: 'id' })
  post_id: KtqPost['id'];
}
