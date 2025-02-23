import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqLikesService } from '../services/ktq-likes.service';
import DeletesDto from '../dto/deletes.dto';
import { KtqLike } from '../entities/ktq-like.entity';

@Controller('admin/likes')
export class KtqLikesController {
  constructor(private readonly ktqLikesService: KtqLikesService) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqLikesService.index(query);
  }

  @Delete(':id')
  async delete(@Param('id') id: KtqLike['id']) {
    return await this.ktqLikesService.delete(id);
  }

  @Post('deletes')
  async deletes(@Body() data: DeletesDto<KtqLike['id']>) {
    return await this.ktqLikesService.deletes(data.ids);
  }
}
