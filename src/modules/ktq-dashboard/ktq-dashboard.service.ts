import { Injectable } from '@nestjs/common';
import { CreateKtqDashboardDto } from './dto/create-ktq-dashboard.dto';
import { UpdateKtqDashboardDto } from './dto/update-ktq-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import KtqPost from '../ktq-posts/entities/ktq-post.entity';
import { Between, Repository } from 'typeorm';
import KtqResponse from '@/system/response/ktq-response';
import { KtqLike } from '../ktq-posts/entities/ktq-like.entity';
import { KtqHistory } from '../ktq-posts/entities/ktq-history.entity';

@Injectable()
export class KtqDashboardService {
  constructor(
    @InjectRepository(KtqPost)
    readonly ktqPostsRepo: Repository<KtqPost>,
    @InjectRepository(KtqLike)
    readonly ktqLikesRepo: Repository<KtqLike>,
    @InjectRepository(KtqHistory)
    readonly ktqHistoriesRepo: Repository<KtqHistory>,
  ) {}

  async index() {
    const posts_count = (await this.ktqPostsRepo.count()) || 0;

    const like_count =
      (await this.ktqLikesRepo.count({ where: { action: 'like' } })) || 0;

    const histories_count = (await this.ktqHistoriesRepo.count()) || 0;

    return KtqResponse.toResponse({
      posts_count,
      like_count,
      histories_count,
    });
  }
}
