import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { KtqMediasService } from '../ktq-medias.service';

const uploadPath = 'uploads/images';

if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath, { recursive: true });
}

@Controller('client-medias')
export class KtqClientMediasController {
  constructor(private readonly ktqMediasService: KtqMediasService) {}

  @Get(':name')
  async getMedia(@Param('name') name: string, @Res() res: Response) {
    return await this.ktqMediasService.getMedia(name, res);
  }
}
