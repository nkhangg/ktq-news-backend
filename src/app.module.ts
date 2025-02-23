import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { KtqAdminsModule } from './modules/ktq-admins/ktq-admins.module';
import { KtqAppConfigsModule } from './modules/ktq-app-configs/ktq-app-configs.module';
import { KtqDatabasesModule } from './modules/ktq-databases/ktq-databases.module';
import { KtqAuthModule } from './modules/ktq-auth/ktq-auth.module';
import { excludeAuth, excludeAuthor } from './system/routes/exclude-route';
import { KtqAppValidatorsModule } from './modules/ktq-app-validators/ktq-app-validators.module';
import { AuthenticationMiddleware } from './modules/ktq-auth/middlewares/authentication.middleware';
import { AuthorizationMiddleware } from './modules/ktq-admins/middlewares/authorization.middleware';
import { KtqConfigsModule } from './modules/ktq-configs/ktq-configs.module';
import { KtqMediasModule } from './modules/ktq-medias/ktq-medias.module';
import { KtqPostsModule } from './modules/ktq-posts/ktq-posts.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { KtqFeedbackModule } from './modules/ktq-feedback/ktq-feedback.module';

@Module({
  imports: [
    KtqDatabasesModule,
    KtqAppConfigsModule,
    KtqAdminsModule,
    KtqAuthModule,
    KtqAppValidatorsModule,
    KtqConfigsModule,
    KtqMediasModule,
    KtqPostsModule,
    KtqFeedbackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(...excludeAuth)
      .forRoutes({ path: 'admin/*', method: RequestMethod.ALL });

    consumer
      .apply(AuthorizationMiddleware)
      .exclude(...excludeAuthor)
      .forRoutes({ path: 'admin/*', method: RequestMethod.ALL });
  }
}
