import KtqResponse from '@/system/response/ktq-response';
import {
  BadGatewayException,
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
import { In, Not, Repository } from 'typeorm';
import KtqTag from '../entities/ktq-tag.entity';

@Injectable()
export class KtqTagsService {
  constructor(
    @InjectRepository(KtqTag)
    readonly ktqTagRepo: Repository<KtqTag>,
  ) {}

  async index(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqTag> | (string & {})]?:
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

    const data = await paginate(query, this.ktqTagRepo, {
      sortableColumns: ['id', 'name', 'created_at', 'updated_at'],
      searchableColumns: ['id', 'name'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
    });

    return KtqResponse.toPagination<KtqTag>(data, true, KtqTag);
  }

  async create(data: Pick<KtqTag, 'name' | 'slug'>) {
    const category = await this.ktqTagRepo.save(data);

    if (!category)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't create tag" }),
      );

    return KtqResponse.toResponse(true);
  }

  async update(id: KtqTag['id'], data: Partial<KtqTag>) {
    const tag = await this.ktqTagRepo.findOne({ where: { id } });

    if (!tag)
      throw new NotFoundException(
        KtqResponse.toResponse(false, {
          message: 'Tag not found',
          status_code: HttpStatus.NOT_FOUND,
        }),
      );

    if (data.slug) {
      const duplicateSlug = await this.ktqTagRepo.findOne({
        where: { slug: data.slug, id: Not(id) },
      });

      if (duplicateSlug) {
        throw new BadGatewayException(
          KtqResponse.toResponse(false, { message: 'Slug is already exists' }),
        );
      }
    }

    const result = await this.ktqTagRepo.update(id, { ...data });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't update tag" }),
      );

    return KtqResponse.toResponse(true);
  }

  async delete(id: KtqTag['id']) {
    const result = await this.ktqTagRepo.delete(id);

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete tag" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }

  async deletes(ids: KtqTag['id'][]) {
    const result = await this.ktqTagRepo.delete({ id: In(ids) });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete tag" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }
}
