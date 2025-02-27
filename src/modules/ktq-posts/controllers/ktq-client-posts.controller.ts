import { Controller, Get, Ip, Param, Query } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqPostsService } from '../services/ktq-posts.service';
import { Throttle } from '@nestjs/throttler';
import KtqPost from '../entities/ktq-post.entity';
import { RealIp } from 'nestjs-real-ip';

@Controller('client/posts')
export class KtqClientPostsController {
  constructor(private readonly ktqPostsService: KtqPostsService) {}

  @Get()
  @Throttle({ default: { limit: 30, ttl: 60 * 1000 } })
  async index(
    @Paginate() query: PaginateQuery,
    @Query('ignore') ignore: string,
  ) {
    return await this.ktqPostsService.index({ ...query, ignore }, true);
  }

  @Get('sitemaps')
  @Throttle({ default: { limit: 5, ttl: 60 * 1000 } })
  async sitemaps(@Paginate() query: PaginateQuery) {
    return await this.ktqPostsService.sitemaps({ ...query });
  }

  @Get(':slug')
  async getBySlug(
    @Param('slug') slug: KtqPost['slug'],
    @RealIp() ip_client: string,
  ) {
    return await this.ktqPostsService.getBySlug(slug, ip_client);
  }

  @Get('metadata/:slug')
  async getMetadata(@Param('slug') slug: KtqPost['slug']) {
    return await this.ktqPostsService.getMetadata(slug);
  }
}
