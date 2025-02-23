import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { KtqSearchHistory } from '../entities/ktq-search-histories.entity';
import KtqPost from '../entities/ktq-post.entity';
import KtqResponse from '@/system/response/ktq-response';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';

@Injectable()
export class KtqSearchHistoriesService {
  constructor(
    @InjectRepository(KtqSearchHistory)
    readonly ktqSearchHistoryRepo: Repository<KtqSearchHistory>,
    @InjectRepository(KtqPost)
    private readonly ktqPostRepo: Repository<KtqPost>,
  ) {}

  async index(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqSearchHistory> | (string & {})]?:
        | (FilterOperator | FilterSuffix)[]
        | true;
    } = {
      id: true,
      search_count: true,
    };

    query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

    const data = await paginate(query, this.ktqSearchHistoryRepo, {
      sortableColumns: ['id', 'search_count', 'created_at', 'updated_at'],
      searchableColumns: ['id', 'search_count'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
      relations: {
        post: true,
      },
    });

    return KtqResponse.toPagination<KtqSearchHistory>(
      data,
      true,
      KtqSearchHistory,
    );
  }

  async incrementSearchCount(post_id: KtqPost['id']) {
    const post = await this.ktqPostRepo.findOne({ where: { id: post_id } });

    if (!post) {
      throw new NotFoundException(
        KtqResponse.toResponse(false, {
          message: `Post not found`,
          status_code: HttpStatus.NOT_FOUND,
        }),
      );
    }

    let searchHistory = await this.ktqSearchHistoryRepo.findOne({
      where: { post: { id: post_id } },
    });

    if (searchHistory) {
      searchHistory.search_count += 1;
    } else {
      searchHistory = this.ktqSearchHistoryRepo.create({
        post,
        search_count: 1,
      });
    }

    await this.ktqSearchHistoryRepo.save(searchHistory);
    return KtqResponse.toResponse(true);
  }

  async update(id: KtqSearchHistory['id'], search_count: number) {
    let searchHistory = await this.ktqSearchHistoryRepo.findOne({
      where: { id: id },
    });

    if (!searchHistory) {
      throw new NotFoundException(
        KtqResponse.toResponse(false, {
          message: "Can't not found search history",
          status_code: HttpStatus.NOT_FOUND,
        }),
      );
    }

    const result = await this.ktqSearchHistoryRepo.update(id, { search_count });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: "Can't update search history",
        }),
      );
    return KtqResponse.toResponse(true);
  }

  async create(post_id: KtqPost['id'], search_count?: number) {
    const post = await this.ktqPostRepo.findOne({ where: { id: post_id } });

    if (!post) {
      throw new NotFoundException(
        KtqResponse.toResponse(false, {
          message: `Post not found`,
          status_code: HttpStatus.NOT_FOUND,
        }),
      );
    }

    let searchHistory = await this.ktqSearchHistoryRepo.findOne({
      where: { post: { id: post_id } },
    });

    if (searchHistory) {
      return KtqResponse.toResponse(true);
    }

    const result = await this.ktqSearchHistoryRepo.save({ post, search_count });

    if (!result)
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: "Can't create search history",
        }),
      );

    return KtqResponse.toResponse(true);
  }

  async delete(id: KtqSearchHistory['id']) {
    const result = await this.ktqSearchHistoryRepo.delete(id);

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: "Can't delete search history",
        }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }

  async deletes(ids: KtqSearchHistory['id'][]) {
    const result = await this.ktqSearchHistoryRepo.delete({ id: In(ids) });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete categories" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }
}
