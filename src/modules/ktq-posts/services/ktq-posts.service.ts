import KtqResponse from '@/system/response/ktq-response';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { In, Not, Repository } from 'typeorm';
import CreatePostDto from '../dto/create-post.dto';
import UpdatePostDto from '../dto/update-post';
import KtqCategory from '../entities/ktq-category.entity';
import KtqPost from '../entities/ktq-post.entity';
import { EventConstant } from '../events/event.constant';
import WatchPostEvent from '../events/interfaces/watch-post.event';
import { isNumeric } from '../ultils';

@Injectable()
export class KtqPostsService {
  constructor(
    @InjectRepository(KtqPost)
    readonly ktqPostRepo: Repository<KtqPost>,
    @InjectRepository(KtqCategory)
    readonly ktqCategoryRepo: Repository<KtqCategory>,
    private eventEmitter: EventEmitter2,
  ) {}

  async index(query: PaginateQuery & { ignore?: string }, client_mode = false) {
    const filterableColumns: {
      [key in Column<KtqPost> | (string & {})]?:
        | (FilterOperator | FilterSuffix)[]
        | true;
    } = {
      id: true,
      title: [FilterOperator.ILIKE],
      like_count: true,
      ttr: [FilterOperator.GT, FilterOperator.LTE],
      content: [FilterOperator.ILIKE],
      path: true,
      'category.slug': true,
      'tags.slug': true,
    };

    query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

    const data = await paginate(query, this.ktqPostRepo, {
      sortableColumns: [
        'id',
        'title',
        'content',
        'preview_content',
        'like_count',
        'created_at',
        'updated_at',
      ],
      searchableColumns: ['id', 'title', 'slug', 'preview_content', 'content'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
      relations: {
        admin: true,
        tags: true,
        category: true,
      },
      where:
        query.ignore && isNumeric(query.ignore)
          ? { id: Not(Number(query.ignore)) }
          : undefined,
    });

    if (client_mode) {
      const newData = data.data.map((item) => {
        return {
          ...item,
          admin: { fullname: item.admin.fullname || null },
        };
      });

      data.data = newData as KtqPost[];

      return KtqResponse.toPagination<KtqPost>(data, true, KtqPost);
    }

    return KtqResponse.toPagination<KtqPost>(data, true, KtqPost);
  }

  async sitemaps(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqPost> | (string & {})]?:
        | (FilterOperator | FilterSuffix)[]
        | true;
    } = {
      id: true,
      title: [FilterOperator.ILIKE],
      like_count: true,
      ttr: [FilterOperator.GT, FilterOperator.LTE],
      content: [FilterOperator.ILIKE],
      path: true,
      'category.slug': true,
      'tags.slug': true,
    };

    query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

    const data = await paginate(query, this.ktqPostRepo, {
      sortableColumns: [
        'id',
        'title',
        'content',
        'preview_content',
        'like_count',
        'created_at',
        'updated_at',
      ],
      searchableColumns: ['id', 'title', 'slug', 'preview_content', 'content'],
      defaultLimit: 100,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
      relations: {
        category: true,
      },

      select: ['id', 'slug', 'category.slug', 'updated_at'],
    });

    return KtqResponse.toPagination<KtqPost>(data, true, KtqPost);
  }

  async getById(id: KtqPost['id']) {
    const post = await this.ktqPostRepo.findOne({
      where: { id },
      relations: {
        admin: true,
        category: true,
        tags: true,
      },
    });

    if (!post)
      throw new NotFoundException(
        KtqResponse.toResponse(null, {
          message: 'Not found post',
          status_code: HttpStatus.NOT_FOUND,
        }),
      );

    return KtqResponse.toResponse(plainToClass(KtqPost, post));
  }

  async getMetadata(slug: KtqPost['slug']) {
    const post = await this.ktqPostRepo.findOne({
      where: { slug },
      select: ['title', 'preview_content'],
    });

    if (!post)
      throw new NotFoundException(
        KtqResponse.toResponse(null, {
          message: 'Not found post',
          status_code: HttpStatus.NOT_FOUND,
        }),
      );

    return KtqResponse.toResponse(plainToClass(KtqPost, post));
  }

  async getBySlug(slug: KtqPost['slug'], ip_client: string) {
    const post = await this.ktqPostRepo.findOne({
      where: { slug },
      relations: {
        admin: true,
        category: true,
        tags: true,
      },
      select: {
        admin: {
          fullname: true,
        },
      },
    });

    if (!post)
      throw new NotFoundException(
        KtqResponse.toResponse(null, {
          message: 'Not found post',
          status_code: HttpStatus.NOT_FOUND,
        }),
      );

    this.eventEmitter.emit(
      EventConstant.WATCH_POST,
      new WatchPostEvent(ip_client, post.id),
    );

    return KtqResponse.toResponse(plainToClass(KtqPost, post));
  }

  async create({ category_id, ...data }: CreatePostDto, request: Request) {
    const category = await this.ktqCategoryRepo.findOne({
      where: { id: category_id },
    });

    if (!category)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: 'Category not found' }),
      );

    const admin = request['admin'];

    if (!admin) {
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: 'Admin not found' }),
      );
    }
    const result = await this.ktqPostRepo.save({ ...data, category, admin });

    if (!result)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't create post" }),
      );

    return KtqResponse.toResponse(true, { message: 'Create success !' });
  }

  async update(id: KtqPost['id'], { category_id, ...data }: UpdatePostDto) {
    const prevPost = await this.ktqPostRepo.findOne({ where: { id } });

    if (!prevPost)
      throw new NotFoundException(
        KtqResponse.toResponse(false, {
          message: 'Post not found',
          status_code: HttpStatus.NOT_FOUND,
        }),
      );

    if (data.slug) {
      const duplicateSlug = await this.ktqPostRepo.findOne({
        where: { id: Not(id), slug: data.slug },
      });

      if (duplicateSlug)
        throw new BadRequestException(
          KtqResponse.toResponse(false, { message: 'Slug already exits !' }),
        );
    }

    if (category_id) {
      const category = await this.ktqCategoryRepo.findOne({
        where: { id: category_id },
      });

      if (!category)
        throw new BadRequestException(
          KtqResponse.toResponse(false, { message: 'Category not found' }),
        );

      prevPost.category = category;
    }

    const result = await this.ktqPostRepo.save({
      ...prevPost,
      ...data,
    });

    if (!result)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't update post" }),
      );

    return KtqResponse.toResponse(true, { message: 'Update success !' });
  }

  async delete(id: KtqPost['id']) {
    const result = await this.ktqPostRepo.delete(id);

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete tag" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }

  async deletes(ids: KtqPost['id'][]) {
    const result = await this.ktqPostRepo.delete({ id: In(ids) });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete tag" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }
}
