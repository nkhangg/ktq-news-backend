import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import WatchPostEvent from './interfaces/watch-post.event';
import { KtqHistoriesService } from '../services/ktq-histories.service';
import { EventConstant } from './event.constant';

@Injectable()
export class HandlerEventService {
  constructor(private readonly ktqHistoriesService: KtqHistoriesService) {}

  @OnEvent(EventConstant.WATCH_POST)
  async handlePostLikedEvent({ ip_client, post_id }: WatchPostEvent) {
    await this.ktqHistoriesService.create(ip_client, post_id);
  }
}
