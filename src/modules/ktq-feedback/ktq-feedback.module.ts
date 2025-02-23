import { Module } from '@nestjs/common';
import { KtqFeedbackService } from './ktq-feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqFeedback } from './entities/ktq-feedback.entity';
import { KtqFeedbackController } from './controllers/ktq-feedback.controller';
import { KtqClientFeedbackController } from './controllers/ktq-client-feedback.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KtqFeedback])],
  controllers: [KtqFeedbackController, KtqClientFeedbackController],
  providers: [KtqFeedbackService],
})
export class KtqFeedbackModule {}
