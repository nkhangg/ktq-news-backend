import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import path, { extname, join } from 'path';
import sharp from 'sharp';
import { ALLOWED_IMAGE_EXT } from '../utils/file-store';
import { Constant } from '../utils/constant';
@Injectable()
export class KtqImagesCompressionPipe implements PipeTransform {
  constructor(
    public folder: string,
    public field: string,
    public resize: number = Constant.DEFAULT_RESIZE,
  ) {}

  async transform(
    files: Record<string, Express.Multer.File[]>,
    metadata: ArgumentMetadata,
  ) {
    const medias = files[this.field];

    if (!medias) {
      throw new Error('Media field is undefined');
    }

    const compressedFiles = [];

    for (const file of medias) {
      const ext = path.extname(file.originalname).toLowerCase();

      if (!ALLOWED_IMAGE_EXT.includes(ext)) {
        throw new Error(`File "${file.originalname}" is not a valid image.`);
      }

      try {
        const uploadDir = `public/${this.folder}`;

        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true });
        }

        const filename =
          Date.now() + '-' + file.originalname.replace(ext, '.webp');
        const filePath = path.join(uploadDir, filename);

        await sharp(file.buffer)
          .resize(this.resize)
          .webp({ effort: 3 })
          .toFile(filePath);

        compressedFiles.push({
          ...file,
          filename,
        } as Express.Multer.File);
      } catch (error) {
        throw new Error(
          `Error compressing image "${file.originalname}": ${error.message}`,
        );
      }
    }

    return compressedFiles;
  }
}
