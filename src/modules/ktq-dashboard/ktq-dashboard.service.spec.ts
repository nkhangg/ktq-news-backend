import { Test, TestingModule } from '@nestjs/testing';
import { KtqDashboardService } from './ktq-dashboard.service';

describe('KtqDashboardService', () => {
  let service: KtqDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqDashboardService],
    }).compile();

    service = module.get<KtqDashboardService>(KtqDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
