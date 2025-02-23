import { Controller, Get } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqTagsService } from '../services/ktq-tags.service';

@Controller('client/tags')
export class KtqClientTagsController {
  constructor(private readonly ktqTagsService: KtqTagsService) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqTagsService.index(query);
  }
}
