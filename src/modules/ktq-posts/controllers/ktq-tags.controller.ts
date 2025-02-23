import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import CreateTagDto from '../dto/create-tag.dto';
import DeletesDto from '../dto/deletes.dto';
import UpdateCategoryDto from '../dto/update-category.dto';
import KtqTag from '../entities/ktq-tag.entity';
import { KtqTagsService } from '../services/ktq-tags.service';

@Controller('admin/tags')
export class KtqTagsController {
  constructor(private readonly ktqTagsService: KtqTagsService) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqTagsService.index(query);
  }

  @Post()
  async create(@Body() data: CreateTagDto) {
    return await this.ktqTagsService.create(data);
  }

  @Post('deletes')
  async deletes(@Body() data: DeletesDto<KtqTag['id']>) {
    return await this.ktqTagsService.deletes(data.ids);
  }

  @Delete(':id')
  async delete(@Param('id') id: KtqTag['id']) {
    return await this.ktqTagsService.delete(id);
  }

  @Put(':id')
  async update(@Param('id') id: KtqTag['id'], @Body() data: UpdateCategoryDto) {
    return await this.ktqTagsService.update(id, data);
  }
}
