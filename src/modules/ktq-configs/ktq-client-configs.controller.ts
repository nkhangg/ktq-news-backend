import { Controller, Get } from '@nestjs/common';
import { KtqConfigsService } from './ktq-configs.service';

@Controller('client/configs')
export class KtqClientConfigsController {
  constructor(private readonly ktqConfigsService: KtqConfigsService) {}

  @Get('footer-data')
  async footerData() {
    return await this.ktqConfigsService.footerData();
  }

  @Get('contact-data')
  async contactData() {
    return await this.ktqConfigsService.contactData();
  }

  @Get('static-sliders-data')
  async staticSlidersData() {
    return await this.ktqConfigsService.getStaticSlidersData();
  }
}
