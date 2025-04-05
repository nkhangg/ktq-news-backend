import { Module } from '@nestjs/common';
import { KtqUsersController } from './controllers/ktq-users.controller';
import { KtqUsersService } from './services/ktq-users.service';
import { GoogleStrategy } from './services/strategies/google.strategy';
import { KtqUsersAuthController } from './controllers/auth/ktq-users-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqUser } from './entities/ktq-user.entity';
import { KtqUserAuthentication } from './entities/ktq-user-authentication.entity';
import { KtqUsersAuthService } from './services/ktq-user-auth.service';
import { KtqTokenBlackList } from './entities/ktq-token-black-lists.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KtqUser,
      KtqUserAuthentication,
      KtqTokenBlackList,
    ]),
  ],
  controllers: [KtqUsersController, KtqUsersAuthController],
  providers: [KtqUsersService, GoogleStrategy, KtqUsersAuthService],
  exports: [KtqUsersService, GoogleStrategy, KtqUsersAuthService],
})
export class KtqUsersModule {}
