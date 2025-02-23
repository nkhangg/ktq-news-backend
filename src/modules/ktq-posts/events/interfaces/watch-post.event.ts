import KtqPost from '../../entities/ktq-post.entity';

export default class WatchPostEvent {
  constructor(ip_client: string, post_id: KtqPost['id']) {
    this.ip_client = ip_client;
    this.post_id = post_id;
  }

  post_id: KtqPost['id'];

  ip_client: string;
}
