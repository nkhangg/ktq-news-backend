import { Body, Controller, Get, Ip, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import ToggleLikeDto from '../dto/toggle-like.dto';
import KtqPost from '../entities/ktq-post.entity';
import { KtqLikesService } from '../services/ktq-likes.service';

@Controller('client/likes')
export class KtqClientLikesController {
  constructor(private readonly ktqLikesService: KtqLikesService) {}

  @Post()
  @Throttle({
    default: { limit: 1, ttl: 5 * 1000 },
  })
  async toggleLike(@Body() data: ToggleLikeDto, @Ip() ipClient: string) {
    return await this.ktqLikesService.toggleLike(data.post_id, ipClient);
  }

  @Get('post/:id')
  async getLikeByPost(@Param('id') id: KtqPost['id']) {
    return await this.ktqLikesService.getLikeByPost(id);
  }
}
