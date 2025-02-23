import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { KtqPostsService } from '../services/ktq-posts.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import KtqPost from '../entities/ktq-post.entity';
import DeletesDto from '../dto/deletes.dto';
import CreatePostDto from '../dto/create-post.dto';
import { Request } from 'express';
import UpdatePostDto from '../dto/update-post';

@Controller('admin/posts')
export class KtqPostsController {
  constructor(private readonly ktqPostsService: KtqPostsService) {}

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return await this.ktqPostsService.index(query);
  }

  @Get(':id')
  async getById(@Param('id') id: KtqPost['id']) {
    return await this.ktqPostsService.getById(id);
  }

  @Put(':id')
  async update(@Param('id') id: KtqPost['id'], @Body() data: UpdatePostDto) {
    return await this.ktqPostsService.update(id, data);
  }

  @Post('deletes')
  async deletes(@Body() data: DeletesDto<KtqPost['id']>) {
    return await this.ktqPostsService.deletes(data.ids);
  }

  @Post()
  async create(@Body() data: CreatePostDto, @Req() request: Request) {
    return await this.ktqPostsService.create(data, request);
  }

  @Delete(':id')
  async delete(@Param('id') id: KtqPost['id']) {
    return await this.ktqPostsService.delete(id);
  }
}
