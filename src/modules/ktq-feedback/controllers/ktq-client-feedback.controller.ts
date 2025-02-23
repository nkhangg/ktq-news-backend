import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreateDto } from '../dto/create.dto';
import { KtqFeedbackService } from '../ktq-feedback.service';

@Controller('client/feedbacks')
export class KtqClientFeedbackController {
  constructor(private readonly ktqFeedbackService: KtqFeedbackService) {}

  @Post()
  @Throttle({ default: { limit: 1, ttl: 30 * 1000 } })
  async create(@Body() data: CreateDto) {
    return await this.ktqFeedbackService.create(data);
  }
}
