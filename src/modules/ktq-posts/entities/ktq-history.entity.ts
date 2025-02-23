import { Timestamp } from '@/entities/timestamp';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import KtqPost from './ktq-post.entity';

@Entity('ktq_histories')
@Unique(['ip_client', 'post'])
export class KtqHistory extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  ip_client: string;

  @ManyToOne(() => KtqPost, (post) => post.histories, {
    cascade: ['update', 'remove'],
  })
  @JoinColumn({ name: 'post' })
  post: KtqPost;
}
