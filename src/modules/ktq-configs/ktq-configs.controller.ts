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
import { KtqConfigsService } from './ktq-configs.service';
import { CreateDto } from './dto/create.dto';
import { KtqConfig } from './entities/ktq-config.entity';
import { DeletesDto } from './dto/deletes.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('admin/configs')
export class KtqConfigsController {
  constructor(private readonly ktqConfigsService: KtqConfigsService) {}

  @Post()
  async create(@Body() data: CreateDto) {
    return await this.ktqConfigsService.create(data);
  }

  @Delete(':id')
  async delete(@Param('id') id: KtqConfig['id']) {
    return await this.ktqConfigsService.delete(id);
  }

  @Post('deletes')
  async deletes(@Body() data: DeletesDto) {
    return await this.ktqConfigsService.deletes(data.ids);
  }

  @Put(':id')
  async update(@Param('id') id: KtqConfig['id'], @Body() data: UpdateDto) {
    return await this.ktqConfigsService.update(id, data);
  }

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqConfigsService.index(query);
  }
}
