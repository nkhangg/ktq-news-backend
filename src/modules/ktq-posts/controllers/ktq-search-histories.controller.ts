import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import DeletesDto from '../dto/deletes.dto';
import { KtqSearchHistory } from '../entities/ktq-search-histories.entity';
import { KtqSearchHistoriesService } from '../services/ktq-search-histories.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import IncreaseSearchHistoryDto from '../dto/increase-search-history.dto';
import CreateSearchHistoryDto from '../dto/create-search-history.dto';
import UpdateSearchHistoryDto from '../dto/update-search-history.dto';

@Controller('admin/search-histories')
export class KtqSearchHistoriesController {
  constructor(
    private readonly ktqSearchHistoriesService: KtqSearchHistoriesService,
  ) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqSearchHistoriesService.index(query);
  }

  @Post()
  async create(@Body() data: CreateSearchHistoryDto) {
    return await this.ktqSearchHistoriesService.create(
      data.post_id,
      data.search_count,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: KtqSearchHistory['id'],
    @Body() data: UpdateSearchHistoryDto,
  ) {
    return await this.ktqSearchHistoriesService.update(id, data.search_count);
  }

  @Delete(':id')
  async delete(@Param('id') id: KtqSearchHistory['id']) {
    return await this.ktqSearchHistoriesService.delete(id);
  }

  @Post('deletes')
  async deletes(@Body() data: DeletesDto<KtqSearchHistory['id']>) {
    return await this.ktqSearchHistoriesService.deletes(data.ids);
  }
}
