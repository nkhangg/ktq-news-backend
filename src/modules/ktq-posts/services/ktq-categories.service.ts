import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import KtqCategory from '../entities/ktq-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import KtqResponse from '@/system/response/ktq-response';

@Injectable()
export class KtqCategoriesService {
  constructor(
    @InjectRepository(KtqCategory)
    readonly ktqCategoryRepo: Repository<KtqCategory>,
  ) {}

  async index(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqCategory> | (string & {})]?:
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

    const data = await paginate(query, this.ktqCategoryRepo, {
      sortableColumns: [
        'id',
        'name',
        'description',
        'created_at',
        'updated_at',
      ],
      searchableColumns: ['id', 'name', 'description'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
      relations: {
        posts: true,
      },
    });

    return KtqResponse.toPagination<KtqCategory>(data, true, KtqCategory);
  }

  async create(data: Pick<KtqCategory, 'name' | 'description' | 'slug'>) {
    const category = await this.ktqCategoryRepo.save(data);

    if (!category)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't create category" }),
      );

    return KtqResponse.toResponse(true);
  }

  async update(id: KtqCategory['id'], data: Partial<KtqCategory>) {
    const category = await this.ktqCategoryRepo.findOne({ where: { id } });

    if (!category)
      throw new NotFoundException(
        KtqResponse.toResponse(false, {
          message: 'Category not found',
          status_code: HttpStatus.NOT_FOUND,
        }),
      );

    if (data.slug) {
      const duplicateSlug = await this.ktqCategoryRepo.findOne({
        where: { slug: data.slug, id: Not(id) },
      });

      if (duplicateSlug) {
        throw new BadGatewayException(
          KtqResponse.toResponse(false, { message: 'Slug is already exists' }),
        );
      }
    }

    const result = await this.ktqCategoryRepo.update(id, { ...data });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't update category" }),
      );

    return KtqResponse.toResponse(true);
  }

  async delete(id: KtqCategory['id']) {
    try {
      const result = await this.ktqCategoryRepo.delete(id);

      if (!result.affected)
        throw new BadRequestException(
          KtqResponse.toResponse(false, { message: "Can't delete category" }),
        );

      return KtqResponse.toResponse(true, { message: 'Delete success !' });
    } catch (error) {
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: 'This category used in some post',
        }),
      );
    }
  }

  async deletes(ids: KtqCategory['id'][]) {
    try {
      const result = await this.ktqCategoryRepo.delete({ id: In(ids) });

      if (!result.affected)
        throw new BadRequestException(
          KtqResponse.toResponse(false, { message: "Can't delete category" }),
        );

      return KtqResponse.toResponse(true, { message: 'Delete success !' });
    } catch (error) {
      throw new BadRequestException(
        KtqResponse.toResponse(false, {
          message: 'This category used in some post',
        }),
      );
    }
  }
}
