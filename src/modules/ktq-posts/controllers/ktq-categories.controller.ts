import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { KtqCategoriesService } from '../services/ktq-categories.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import CreateCategoryDto from '../dto/create-category.dto';
import UpdateCategoryDto from '../dto/update-category.dto';
import KtqCategory from '../entities/ktq-category.entity';
import DeletesDto from '../dto/deletes.dto';

@Controller('admin/categories')
export class KtqCategoriesController {
  constructor(private readonly ktqCategoriesService: KtqCategoriesService) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqCategoriesService.index(query);
  }

  @Post()
  async create(@Body() data: CreateCategoryDto) {
    return await this.ktqCategoriesService.create(data);
  }

  @Post('deletes')
  async deletes(@Body() data: DeletesDto<KtqCategory['id']>) {
    return await this.ktqCategoriesService.deletes(data.ids);
  }

  @Delete(':id')
  async delete(@Param('id') id: KtqCategory['id']) {
    return await this.ktqCategoriesService.delete(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: KtqCategory['id'],
    @Body() data: UpdateCategoryDto,
  ) {
    return await this.ktqCategoriesService.update(id, data);
  }
}
