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
import { KtqLike } from '../entities/ktq-like.entity';
import KtqPost from '../entities/ktq-post.entity';

@Injectable()
export class KtqLikesService {
  constructor(
    @InjectRepository(KtqLike)
    readonly ktqLikeRepo: Repository<KtqLike>,
    @InjectRepository(KtqPost)
    readonly ktqPostRepo: Repository<KtqPost>,
  ) {}

  private readonly WAITING_TIME = 2;

  async index(query: PaginateQuery) {
    const filterableColumns: {
      [key in Column<KtqLike> | (string & {})]?:
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

    const data = await paginate(query, this.ktqLikeRepo, {
      sortableColumns: [
        'id',
        'ip_client',
        'action',
        'created_at',
        'updated_at',
      ],
      searchableColumns: ['id', 'ip_client', 'action'],
      defaultLimit: 15,
      filterableColumns,
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 100,
    });

    return KtqResponse.toPagination<KtqLike>(data, true, KtqLike);
  }

  async getLikeByPostAndIp(postId: number, ip_client: string) {
    return this.ktqLikeRepo.findOne({
      where: { post: { id: postId }, ip_client },
      relations: ['post'],
    });
  }

  async getLikeByPost(post_id: KtqPost['id']) {
    const like = await this.ktqLikeRepo.findOne({
      where: { post: { id: post_id } },
      relations: { post: true },
      select: ['action', 'id', 'post'],
    });

    if (!like)
      throw new NotFoundException(
        KtqResponse.toResponse(null, { message: 'Data not found' }),
      );

    return KtqResponse.toResponse(like);
  }

  async toggleLike(postId: number, ip_client: string) {
    const now = new Date();
    let like = await this.ktqLikeRepo.findOne({
      where: { post: { id: postId }, ip_client },
      relations: {
        post: true,
      },
    });

    if (like) {
      like.action = like.action === 'like' ? 'unlike' : 'like';
      like.post.like_count =
        like.action === 'like'
          ? like.post.like_count + 1
          : Math.max(0, like.post.like_count - 1);
      like.updated_at = now;

      const result = await this.ktqLikeRepo.save(like);

      if (!result)
        throw new BadRequestException(
          KtqResponse.toResponse(null, { message: "Can't like" }),
        );

      return KtqResponse.toResponse(result);
    }

    like = this.ktqLikeRepo.create({
      ip_client,
      post: { id: postId },
      action: 'like',
    });
    const result = await this.ktqLikeRepo.save(like);

    if (!result)
      throw new BadRequestException(
        KtqResponse.toResponse(null, { message: "Can't like" }),
      );

    // Tăng like_count trong bảng post mà không cần query ra
    await this.ktqPostRepo
      .createQueryBuilder()
      .update('ktq_posts')
      .set({ like_count: () => 'like_count + 1' })
      .where('id = :postId', { postId })
      .execute();

    const likeWithPost = await this.ktqLikeRepo.findOne({
      where: { id: result.id },
      relations: {
        post: true,
      },
      select: ['id', 'action', 'post'],
    });

    return KtqResponse.toResponse(likeWithPost);
  }

  async delete(id: KtqLike['id']) {
    const result = await this.ktqLikeRepo.delete(id);

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete like" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }

  async deletes(ids: KtqLike['id'][]) {
    const result = await this.ktqLikeRepo.delete({ id: In(ids) });

    if (!result.affected)
      throw new BadRequestException(
        KtqResponse.toResponse(false, { message: "Can't delete like" }),
      );

    return KtqResponse.toResponse(true, { message: 'Delete success !' });
  }
}
