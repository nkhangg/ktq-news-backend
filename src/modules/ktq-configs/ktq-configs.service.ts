import KtqResponse from '@/system/response/ktq-response';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { In, Repository } from 'typeorm';
import { KtqConfig } from './entities/ktq-config.entity';
import { Constant } from './utils/constant';

@Injectable()
export class KtqConfigsService {
  constructor(
    @InjectRepository(KtqConfig)
    readonly ktqConfigRepo: Repository<KtqConfig>,
  ) {}

  async index(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqConfig> | (string & {})]?:
        | (FilterOperator | FilterSuffix)[]
        | true;
    } = {
      id: true,
      key_name: true,
      type: true,
      value: [FilterOperator.ILIKE],
    };

    query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

    const data = await paginate(query, this.ktqConfigRepo, {
      sortableColumns: ['id', 'key_name', 'value', 'type'],
      searchableColumns: ['id', 'key_name', 'value', 'type'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
    });

    return KtqResponse.toPagination<KtqConfig>(data, true, KtqConfig);
  }

  async create(config: Omit<KtqConfig, 'id' | 'created_at' | 'updated_at'>) {
    const result = await this.ktqConfigRepo.save(config);

    if (!result)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't create config" }),
      );

    return KtqResponse.toResponse(true, { message: 'Config was created !' });
  }

  async update(id: KtqConfig['id'], data: Partial<KtqConfig>) {
    const config = await this.ktqConfigRepo.findOne({ where: { id } });

    if (!config) {
      throw new NotFoundException(
        KtqResponse.toResponse(false, {
          message: 'Config not found',
          status_code: HttpStatus.NOT_FOUND,
        }),
      );
    }

    const result = await this.ktqConfigRepo.update(id, data);

    if (!result)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't create config" }),
      );

    return KtqResponse.toResponse(true, { message: 'Config was created !' });
  }

  async delete(id: KtqConfig['id']) {
    const result = await this.ktqConfigRepo.delete({ id });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete config" }),
      );

    return KtqResponse.toResponse(true, { message: 'Config was deleted !' });
  }

  async deletes(ids: KtqConfig['id'][]) {
    const result = await this.ktqConfigRepo.delete({ id: In(ids) });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete config" }),
      );

    return KtqResponse.toResponse(true, {
      message: `Delete success ${result.affected} config`,
    });
  }

  async footerData() {
    const result = await this.ktqConfigRepo.find({
      where: {
        key_name: In(['footer-data', 'description-website', 'primary-email']),
      },
    });

    return KtqResponse.toResponse(result);
  }

  async contactData() {
    const result = await this.ktqConfigRepo.find({
      where: {
        key_name: In(['contact-email', 'primary-email']),
      },
    });

    return KtqResponse.toResponse(result);
  }

  async getNotFoundMediaConfig() {
    const result = await this.ktqConfigRepo.findOne({
      where: { key_name: Constant.MEDIA_NOT_FOUND_KEY },
    });

    return result;
  }
}
