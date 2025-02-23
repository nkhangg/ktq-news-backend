import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import KtqTag from '../entities/ktq-tag.entity';
import KtqCategory from '../entities/ktq-category.entity';
import KtqPost from '../entities/ktq-post.entity';
import { KtqViewCommonSliders } from '../entities/views/ktq-view-common-sliders.entity';
import KtqResponse from '@/system/response/ktq-response';
import { KtqViewCommonCategoriesTopic } from '../entities/views/ktq-view-categories-topic.entity';

@Injectable()
export class KtqCommonsService {
  constructor(
    @InjectRepository(KtqTag)
    readonly ktqTagRepo: Repository<KtqTag>,
    @InjectRepository(KtqCategory)
    readonly ktqCategoryRepo: Repository<KtqCategory>,
    @InjectRepository(KtqPost)
    readonly ktqPostRepo: Repository<KtqPost>,
    @InjectRepository(KtqViewCommonSliders)
    readonly viewCommonSlidersRepo: Repository<KtqViewCommonSliders>,
    @InjectRepository(KtqViewCommonCategoriesTopic)
    readonly viewCategoriesTopicRepo: Repository<KtqViewCommonCategoriesTopic>,
  ) {}

  async sliders() {
    const result = await this.viewCommonSlidersRepo.find();

    return KtqResponse.toResponse(result[0]);
  }

  async outstanding() {
    const result = await this.ktqPostRepo.find({
      take: 10,
      order: {
        like_count: 'DESC',
      },
      relations: {
        admin: true,
        category: true,
      },
    });

    return KtqResponse.toResponse(result);
  }

  async homeData() {
    const likesRank = await this.ktqPostRepo.find({
      take: 5,
      order: {
        like_count: 'DESC',
      },
      relations: {
        admin: true,
        category: true,
      },
    });

    const historiesRank = await this.ktqPostRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.admin', 'admin') // Lấy dữ liệu admin
      .leftJoinAndSelect('post.category', 'category') // Lấy dữ liệu category
      .leftJoin('post.histories', 'history') // Join với bảng histories nhưng không lấy dữ liệu chi tiết
      .addSelect('COUNT(history.id)', 'historyCount') // Đếm số lượng histories
      .groupBy('post.id') // Gom nhóm theo post.id để COUNT() hoạt động đúng
      .addGroupBy('admin.id') // Cần thêm để tránh lỗi khi join nhiều bảng
      .addGroupBy('category.id') // Cần thêm để tránh lỗi
      .orderBy('historyCount', 'DESC') // Sắp xếp theo số lượng histories giảm dần
      .limit(5)
      .getMany();

    return KtqResponse.toResponse({
      likes_rank: likesRank,
      histories_rank: historiesRank,
    });
  }

  async categoriesTopic() {
    const result = await this.viewCategoriesTopicRepo.find();

    return KtqResponse.toResponse(result || []);
  }
}
