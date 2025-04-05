import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { KtqAdminsModule } from './modules/ktq-admins/ktq-admins.module';
import { AuthorizationMiddleware } from './modules/ktq-admins/middlewares/authorization.middleware';
import { KtqAppConfigsModule } from './modules/ktq-app-configs/ktq-app-configs.module';
import { KtqAppValidatorsModule } from './modules/ktq-app-validators/ktq-app-validators.module';
import { KtqAuthModule } from './modules/ktq-auth/ktq-auth.module';
import { AuthenticationMiddleware } from './modules/ktq-auth/middlewares/authentication.middleware';
import {
  excludeAuth,
  excludeAuthor,
} from './modules/ktq-auth/routes/exclude-route';
import { KtqConfigsModule } from './modules/ktq-configs/ktq-configs.module';
import { KtqDashboardModule } from './modules/ktq-dashboard/ktq-dashboard.module';
import { KtqDatabasesModule } from './modules/ktq-databases/ktq-databases.module';
import { KtqFeedbackModule } from './modules/ktq-feedback/ktq-feedback.module';
import { KtqMediasModule } from './modules/ktq-medias/ktq-medias.module';
import { KtqPostsModule } from './modules/ktq-posts/ktq-posts.module';
import { KtqUsersModule } from './modules/ktq-users/ktq-users.module';
import { UserAuthenticationMiddleware } from './modules/ktq-users/middlewares/user-authentication.middleware';
import { userExcludeAuth } from './modules/ktq-users/routes/exclude-route';

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
    KtqDashboardModule,
    KtqUsersModule,
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
      .apply(UserAuthenticationMiddleware)
      .exclude(...userExcludeAuth)
      .forRoutes({ path: 'client/*', method: RequestMethod.ALL });

    consumer
      .apply(AuthorizationMiddleware)
      .exclude(...excludeAuthor)
      .forRoutes({ path: 'admin/*', method: RequestMethod.ALL });
  }
}
