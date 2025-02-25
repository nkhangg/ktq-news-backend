import { Module } from '@nestjs/common';
import { KtqDashboardService } from './ktq-dashboard.service';
import { KtqDashboardController } from './ktq-dashboard.controller';

@Module({
  controllers: [KtqDashboardController],
  providers: [KtqDashboardService],
})
export class KtqDashboardModule {}
