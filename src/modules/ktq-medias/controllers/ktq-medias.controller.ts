import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { memoryStorage } from 'multer';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateDto } from '../dto/create.dto';
import { DeletesDto } from '../dto/deletes.dto';
import KtqMedia from '../entities/ktq-media.entity';
import { KtqMediasService } from '../ktq-medias.service';

const uploadPath = 'uploads/images';

if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath, { recursive: true });
}

@Controller('admin/medias')
export class KtqMediasController {
  constructor(private readonly ktqMediasService: KtqMediasService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() data: CreateDto,
  ) {
    return this.ktqMediasService.create(image, data.url, {
      width: data.width,
      height: data.height,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: KtqMedia['id']) {
    return this.ktqMediasService.delete(id);
  }

  @Post('deletes')
  async deletes(@Body() data: DeletesDto) {
    return this.ktqMediasService.deletes(data.ids);
  }

  @Get()
  async index(@Paginate() query: PaginateQuery) {
    return this.ktqMediasService.index(query);
  }
}
