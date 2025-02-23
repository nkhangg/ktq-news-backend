import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { ALLOWED_IMAGE_EXT } from '../utils/file-store';
import { Constant } from '../utils/constant';

@Injectable()
export class KtqImageCompressionPipe implements PipeTransform {
  constructor(
    private folder: string = Constant.MEDIA_FOLDER,
    private resize: { width?: number; height?: number },
  ) {}

  async transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_IMAGE_EXT.includes(ext)) {
      throw new BadRequestException(
        `File "${file.originalname}" is not a valid image.`,
      );
    }

    const uploadDir = `public/${this.folder}`;
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${this.resize.width || Constant.DEFAULT_RESIZE}x${this.resize.height || Constant.DEFAULT_RESIZE}-${file.originalname.replace(ext, '.webp')}`;
    const filePath = path.join(uploadDir, filename);

    try {
      await sharp(file.buffer)
        .resize({
          width: this.resize?.width || Constant.DEFAULT_RESIZE,
          height: this.resize?.height || Constant.DEFAULT_RESIZE,
        })
        .webp({ effort: 3 })
        .toFile(filePath);

      return { filename };
    } catch (error) {
      throw new BadRequestException(
        `Error compressing image: ${error.message}`,
      );
    }
  }
}
