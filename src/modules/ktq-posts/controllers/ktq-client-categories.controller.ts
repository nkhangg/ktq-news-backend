import { Controller, Get } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqCategoriesService } from '../services/ktq-categories.service';

@Controller('client/categories')
export class KtqClientCategoriesController {
  constructor(private readonly ktqCategoriesService: KtqCategoriesService) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqCategoriesService.index(query);
  }
}
