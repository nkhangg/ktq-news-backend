import { Body, Controller, Ip, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import CreateHistoryDto from '../dto/create-history.dto';
import { KtqHistoriesService } from '../services/ktq-histories.service';

@Controller('client/histories')
export class KtqClientHistoriesController {
  constructor(private readonly ktqHistoriesService: KtqHistoriesService) {}

  @Post()
  @Throttle({
    default: { limit: 1, ttl: 5 * 1000 },
  })
  async create(@Body() data: CreateHistoryDto, @Ip() ipClient: string) {
    return await this.ktqHistoriesService.create(ipClient, data.post_id);
  }
}
