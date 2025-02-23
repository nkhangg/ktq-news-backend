import { Controller, Get } from '@nestjs/common';
import { KtqCommonsService } from '../services/ktq-commons.service';

@Controller('client/commons')
export class KtqClientCommonController {
  constructor(private readonly ktqCommonsService: KtqCommonsService) {}

  @Get('sliders')
  async sliders() {
    return await this.ktqCommonsService.sliders();
  }

  @Get('outstanding')
  async outstanding() {
    return await this.ktqCommonsService.outstanding();
  }

  @Get('home-data')
  async homeData() {
    return await this.ktqCommonsService.homeData();
  }

  @Get('categories/outstanding')
  async categoriesTopic() {
    return await this.ktqCommonsService.categoriesTopic();
  }
}
