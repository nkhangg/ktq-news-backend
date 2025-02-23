import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';
import KtqMedia from '../entities/ktq-media.entity';

export class DeletesDto {
  @IsNumber({}, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  ids: KtqMedia['id'][];
}
