import { Body, Controller, Delete, Get, Ip, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import CreateHistoryDto from '../dto/create-history.dto';
import { KtqHistoriesService } from '../services/ktq-histories.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqHistory } from '../entities/ktq-history.entity';
import DeletesDto from '../dto/deletes.dto';

@Controller('admin/histories')
export class KtqHistoriesController {
  constructor(private readonly ktqHistoriesService: KtqHistoriesService) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqHistoriesService.index(query);
  }

  @Delete(':id')
  async delete(@Param('id') id: KtqHistory['id']) {
    return await this.ktqHistoriesService.delete(id);
  }

  @Post('deletes')
  async deletes(@Body() data: DeletesDto<KtqHistory['id']>) {
    return await this.ktqHistoriesService.deletes(data.ids);
  }
}
