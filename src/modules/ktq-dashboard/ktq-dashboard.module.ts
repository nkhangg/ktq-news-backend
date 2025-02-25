import { Module } from '@nestjs/common';
import { KtqDashboardService } from './ktq-dashboard.service';
import { KtqDashboardController } from './ktq-dashboard.controller';
import KtqPost from '../ktq-posts/entities/ktq-post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqLike } from '../ktq-posts/entities/ktq-like.entity';
import { KtqHistory } from '../ktq-posts/entities/ktq-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KtqPost, KtqLike, KtqHistory])],
  controllers: [KtqDashboardController],
  providers: [KtqDashboardService],
})
export class KtqDashboardModule {}
