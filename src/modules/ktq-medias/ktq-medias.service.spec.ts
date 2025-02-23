import { Test, TestingModule } from '@nestjs/testing';
import { KtqMediasService } from './ktq-medias.service';

describe('KtqMediasService', () => {
  let service: KtqMediasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqMediasService],
    }).compile();

    service = module.get<KtqMediasService>(KtqMediasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
