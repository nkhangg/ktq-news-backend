import { Test, TestingModule } from '@nestjs/testing';
import { KtqDashboardController } from './ktq-dashboard.controller';
import { KtqDashboardService } from './ktq-dashboard.service';

describe('KtqDashboardController', () => {
  let controller: KtqDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqDashboardController],
      providers: [KtqDashboardService],
    }).compile();

    controller = module.get<KtqDashboardController>(KtqDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
