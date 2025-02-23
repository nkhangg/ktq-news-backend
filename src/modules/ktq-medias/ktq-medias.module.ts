import { Module } from '@nestjs/common';
import { KtqMediasService } from './ktq-medias.service';
import { KtqMediasController } from './controllers/ktq-medias.controller';
import { MulterModule } from '@nestjs/platform-express';
import { Constant } from './utils/constant';
import KtqMedia from './entities/ktq-media.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { memoryStorage } from 'multer';
import { KtqClientMediasController } from './controllers/ktq-client-medias.controller';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KtqMedia]),
    MulterModule.register({
      dest: Constant.MEDIA_PATH,
      storage: memoryStorage(),
    }),
    KtqConfigsModule,
  ],
  controllers: [KtqMediasController, KtqClientMediasController],
  providers: [KtqMediasService],
})
export class KtqMediasModule {}
