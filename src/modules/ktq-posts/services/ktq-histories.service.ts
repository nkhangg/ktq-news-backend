import KtqResponse from '@/system/response/ktq-response';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { In, Repository } from 'typeorm';
import { KtqHistory } from '../entities/ktq-history.entity';
import KtqPost from '../entities/ktq-post.entity';

@Injectable()
export class KtqHistoriesService {
  constructor(
    @InjectRepository(KtqHistory)
    readonly ktqHistoriesRepo: Repository<KtqHistory>,
    @InjectRepository(KtqPost)
    readonly ktqPostRepo: Repository<KtqPost>,
  ) {}

  private readonly WAITING_TIME = 2;

  async index(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqHistory> | (string & {})]?:
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

    const data = await paginate(query, this.ktqHistoriesRepo, {
      sortableColumns: ['id', 'ip_client', 'created_at', 'updated_at'],
      searchableColumns: ['id', 'ip_client'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
    });

    return KtqResponse.toPagination<KtqHistory>(data, true, KtqHistory);
  }

  async create(ip: string, post_id: KtqPost['id']) {
    const prevHistory = await this.ktqHistoriesRepo.findOne({
      where: { ip_client: ip, post: { id: post_id } },
    });

    if (prevHistory) {
      return KtqResponse.toResponse(true);
    }

    const result = await this.ktqHistoriesRepo.save({
      ip_client: ip,
      post: { id: post_id },
    });

    if (!result) throw new BadRequestException(KtqResponse.toResponse(false));

    return KtqResponse.toResponse(true);
  }

  async delete(id: KtqHistory['id']) {
    const result = await this.ktqHistoriesRepo.delete(id);

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete like" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }

  async deletes(ids: KtqHistory['id'][]) {
    const result = await this.ktqHistoriesRepo.delete({ id: In(ids) });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete like" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }
}
