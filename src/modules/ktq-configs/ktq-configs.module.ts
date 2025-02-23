import { Module } from '@nestjs/common';
import { KtqConfigsService } from './ktq-configs.service';
import { KtqConfigsController } from './ktq-configs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqConfig } from './entities/ktq-config.entity';
import { KtqClientConfigsController } from './ktq-client-configs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KtqConfig])],
  controllers: [KtqConfigsController, KtqClientConfigsController],
  providers: [KtqConfigsService],
  exports: [KtqConfigsService],
})
export class KtqConfigsModule {}
