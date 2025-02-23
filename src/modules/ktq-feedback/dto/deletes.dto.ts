import { IsNumber } from 'class-validator';

export class DeletesDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
