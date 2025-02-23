import { IsNumber } from 'class-validator';

export default class DeletesDto<R> {
  @IsNumber({}, { each: true })
  ids: R[];
}
