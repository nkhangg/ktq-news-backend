import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { KtqAuthController } from './ktq-auth.controller';
import { KtqAuthService } from './ktq-auth.service';
import { KtqAdminsModule } from '../ktq-admins/ktq-admins.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '15m' },
    }),
    KtqAdminsModule,
  ],
  controllers: [KtqAuthController],
  providers: [KtqAuthService],
  exports: [KtqAuthService],
})
export class KtqAuthModule {}
