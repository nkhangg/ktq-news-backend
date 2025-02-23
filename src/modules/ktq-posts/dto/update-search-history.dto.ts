import { IsNumber } from 'class-validator';

export default class UpdateSearchHistoryDto {
  @IsNumber()
  search_count: number;
}
