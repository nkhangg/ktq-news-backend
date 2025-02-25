import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqCategoriesController } from './controllers/ktq-categories.controller';
import { KtqClientCategoriesController } from './controllers/ktq-client-categories.controller';
import { KtqClientCommonController } from './controllers/ktq-client-common.controller';
import { KtqClientHistoriesController } from './controllers/ktq-client-histories.controller';
import { KtqClientLikesController } from './controllers/ktq-client-likes.controller';
import { KtqClientPostsController } from './controllers/ktq-client-posts.controller';
import { KtqClientSearchHistoriesController } from './controllers/ktq-client-search-histories.controller';
import { KtqClientTagsController } from './controllers/ktq-client-tags.controller';
import { KtqLikesController } from './controllers/ktq-likes.controller';
import { KtqPostsController } from './controllers/ktq-posts.controller';
import { KtqSearchHistoriesController } from './controllers/ktq-search-histories.controller';
import { KtqTagsController } from './controllers/ktq-tags.controller';
import KtqCategory from './entities/ktq-category.entity';
import { KtqHistory } from './entities/ktq-history.entity';
import { KtqLike } from './entities/ktq-like.entity';
import KtqPost from './entities/ktq-post.entity';
import { KtqSearchHistory } from './entities/ktq-search-histories.entity';
import KtqTag from './entities/ktq-tag.entity';
import { KtqViewCommonCategoriesTopic } from './entities/views/ktq-view-categories-topic.entity';
import { KtqViewCommonSliders } from './entities/views/ktq-view-common-sliders.entity';
import { HandlerEventService } from './events/handler-event.service';
import { KtqCategoriesService } from './services/ktq-categories.service';
import { KtqCommonsService } from './services/ktq-commons.service';
import { KtqHistoriesService } from './services/ktq-histories.service';
import { KtqLikesService } from './services/ktq-likes.service';
import { KtqPostsService } from './services/ktq-posts.service';
import { KtqSearchHistoriesService } from './services/ktq-search-histories.service';
import { KtqTagsService } from './services/ktq-tags.service';
import { KtqHistoriesController } from './controllers/ktq-histories.controller';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KtqCategory,
      KtqPost,
      KtqTag,
      KtqSearchHistory,
      KtqLike,
      KtqViewCommonSliders,
      KtqViewCommonCategoriesTopic,
      KtqHistory,
    ]),
    KtqConfigsModule,
  ],
  controllers: [
    KtqPostsController,
    KtqCategoriesController,
    KtqTagsController,
    KtqHistoriesController,
    KtqSearchHistoriesController,
    KtqClientSearchHistoriesController,
    KtqLikesController,
    KtqClientLikesController,
    KtqClientCommonController,
    KtqClientPostsController,
    KtqClientCategoriesController,
    KtqClientHistoriesController,
    KtqClientTagsController,
  ],
  providers: [
    KtqPostsService,
    KtqCategoriesService,
    KtqTagsService,
    KtqSearchHistoriesService,
    KtqLikesService,
    KtqCommonsService,
    KtqHistoriesService,
    HandlerEventService,
  ],
})
export class KtqPostsModule {}
