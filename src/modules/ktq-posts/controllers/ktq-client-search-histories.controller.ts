import { Body, Controller, Get, Post } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import IncreaseSearchHistoryDto from '../dto/increase-search-history.dto';
import { KtqSearchHistoriesService } from '../services/ktq-search-histories.service';

@Controller('client/search-histories')
export class KtqClientSearchHistoriesController {
  constructor(
    private readonly ktqSearchHistoriesService: KtqSearchHistoriesService,
  ) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqSearchHistoriesService.index(query);
  }

  @Post()
  async incrementSearchCount(@Body() data: IncreaseSearchHistoryDto) {
    return this.ktqSearchHistoriesService.incrementSearchCount(data.post_id);
  }
}
