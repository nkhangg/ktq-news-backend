import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import KtqPost from './ktq-post.entity';
import { Timestamp } from '@/entities/timestamp';

@Entity('search_history')
export class KtqSearchHistory extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => KtqPost, (post) => post.searchHistories)
  post: KtqPost;

  @Column({ type: 'int', default: 1 })
  search_count: number;
}
