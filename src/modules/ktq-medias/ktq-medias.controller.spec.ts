import { Test, TestingModule } from '@nestjs/testing';
import { KtqMediasController } from './controllers/ktq-medias.controller';
import { KtqMediasService } from './ktq-medias.service';

describe('KtqMediasController', () => {
  let controller: KtqMediasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqMediasController],
      providers: [KtqMediasService],
    }).compile();

    controller = module.get<KtqMediasController>(KtqMediasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
