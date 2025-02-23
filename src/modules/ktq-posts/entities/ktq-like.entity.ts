import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import KtqPost from './ktq-post.entity';
import { Timestamp } from '@/entities/timestamp';

@Entity('ktq_likes')
@Unique(['ip_client', 'post']) // Ensure uniqueness like Mongoose's unique index
export class KtqLike extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  ip_client: string;

  @ManyToOne(() => KtqPost, (post) => post.likes, {
    cascade: ['update', 'remove'],
  })
  post: KtqPost;

  @Column({ type: 'varchar', length: 50 })
  action: string;
}
