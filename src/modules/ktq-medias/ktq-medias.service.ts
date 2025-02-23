import KtqResponse from '@/system/response/ktq-response';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import KtqMedia from './entities/ktq-media.entity';
import { KtqImageCompressionPipe } from './pipes/ktq-image-compression-pipe';
import { Constant } from './utils/constant';
import { plainToClass } from 'class-transformer';
import { join } from 'path';
import { existsSync, link, mkdirSync, renameSync, unlinkSync } from 'fs';
import { processImage } from './utils';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { KtqConfigsService } from '../ktq-configs/ktq-configs.service';
import { Response } from 'express';

@Injectable()
export class KtqMediasService {
  constructor(
    @InjectRepository(KtqMedia)
    readonly ktqMediaRepo: Repository<KtqMedia>,
    private readonly dataSource: DataSource,
    private readonly ktqConfigService: KtqConfigsService,
  ) {}

  async create(
    image: Express.Multer.File,
    url?: string,
    resize?: { width: number; height: number },
  ) {
    if (!image && !url) {
      throw new BadRequestException(
        KtqResponse.toResponse(null, { message: 'File or Url is required' }),
      );
    }

    if (image) {
      const data: { filename: string } | undefined =
        await new KtqImageCompressionPipe(
          Constant.MEDIA_FOLDER,
          resize,
        ).transform(image);

      if (!data)
        throw new BadRequestException(
          KtqResponse.toResponse(null, {
            message: "Can't create media",
            status_code: HttpStatus.BAD_REQUEST,
          }),
        );

      const result = await this.ktqMediaRepo.save({
        name: data.filename,
        path: `${Constant.MEDIA_FOLDER}/${data.filename}`,
      });

      return KtqResponse.toResponse(plainToClass(KtqMedia, result));
    }

    const urlData = await processImage(url, resize);

    if (!urlData)
      throw new BadRequestException(
        KtqResponse.toResponse(null, {
          message: 'The url is not available',
          status_code: HttpStatus.BAD_REQUEST,
        }),
      );

    const result = await this.ktqMediaRepo.save({
      name: urlData.filename,
      path: `${Constant.MEDIA_FOLDER}/${urlData.filename}`,
      original_path: url,
    });

    return KtqResponse.toResponse(plainToClass(KtqMedia, result));
  }

  async delete(id: KtqMedia['id']) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const media = await queryRunner.manager.findOne(KtqMedia, {
        where: { id },
      });

      if (!media) {
        throw new BadRequestException(
          KtqResponse.toResponse(false, {
            message: 'Media not found',
            status_code: HttpStatus.NOT_FOUND,
          }),
        );
      }

      const path = `public/${Constant.MEDIA_FOLDER}/${media.name}`;

      if (existsSync(path)) {
        unlinkSync(path);
      }

      const result = await queryRunner.manager.delete(KtqMedia, { id });

      if (!result.affected) {
        throw new BadRequestException(
          KtqResponse.toResponse(false, {
            message: 'Delete failure',
            status_code: HttpStatus.BAD_REQUEST,
          }),
        );
      }

      await queryRunner.commitTransaction();

      return KtqResponse.toResponse(true, { message: 'Delete success!' });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: `Media can't delete`,
          status_code: HttpStatus.BAD_REQUEST,
        }),
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deletes(ids: KtqMedia['id'][]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Danh sách file di chuyển để rollback nếu cần
    const movedFiles: { oldPath: string; tempPath: string }[] = [];

    try {
      // Lấy danh sách media cần xóa
      const medias = await queryRunner.manager.find(KtqMedia, {
        where: { id: In(ids) },
      });

      if (medias.length === 0) {
        throw new BadRequestException(
          KtqResponse.toResponse(false, {
            message: 'No media found',
            status_code: HttpStatus.NOT_FOUND,
          }),
        );
      }

      // Đảm bảo thư mục tạm tồn tại
      const trashFolder = `public/${Constant.TMP_FOLDER}`;
      if (!existsSync(trashFolder)) {
        mkdirSync(trashFolder, { recursive: true });
      }

      // Di chuyển file vào thư mục tạm trước
      medias.forEach((media, index) => {
        const oldPath = `public/${Constant.MEDIA_FOLDER}/${media.name}`;
        const tempPath = `${trashFolder}/${media.name}`;

        if (existsSync(oldPath)) {
          renameSync(oldPath, tempPath);
          movedFiles.push({ oldPath, tempPath });
        }
      });

      // Xóa trong database
      const result = await queryRunner.manager.delete(KtqMedia, ids);

      if (!result.affected) {
        throw new BadRequestException(
          KtqResponse.toResponse(false, {
            message: 'Delete failure',
            status_code: HttpStatus.BAD_REQUEST,
          }),
        );
      }

      // Commit transaction thành công thì xóa file thực sự
      await queryRunner.commitTransaction();
      movedFiles.forEach(({ tempPath }) => {
        if (existsSync(tempPath)) unlinkSync(tempPath);
      });

      return KtqResponse.toResponse(true, { message: 'Delete success!' });
    } catch (error) {
      await queryRunner.rollbackTransaction();

      // Rollback: Di chuyển file từ thư mục tạm về thư mục gốc
      movedFiles.forEach(({ oldPath, tempPath }) => {
        if (existsSync(tempPath)) {
          renameSync(tempPath, oldPath);
        }
      });

      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: `Media can't delete`,
          status_code: HttpStatus.BAD_REQUEST,
        }),
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getMedia(filename: string, res: Response) {
    const rootDir = process.cwd();

    const filePath = join(
      rootDir,
      `${Constant.MEDIA_PATH}/${Constant.MEDIA_FOLDER}/${filename}`,
    );

    if (!existsSync(filePath)) {
      const config = await this.ktqConfigService.getNotFoundMediaConfig();

      if (!config) {
        throw new NotFoundException('Avatar not found');
      }

      return res.redirect(config.value);
    }

    return res.sendFile(filePath);
  }

  async index(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqMedia> | (string & {})]?:
        | (FilterOperator | FilterSuffix)[]
        | true;
    } = {
      id: true,
      media_type: [FilterOperator.ILIKE],
      original_path: true,
      name: [FilterOperator.ILIKE],
      path: true,
    };

    query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

    const data = await paginate(query, this.ktqMediaRepo, {
      sortableColumns: ['id', 'media_type', 'name', 'original_path', 'path'],
      searchableColumns: ['id', 'name', 'original_path', 'path'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
    });

    return KtqResponse.toPagination<KtqMedia>(data, true, KtqMedia);
  }
}
