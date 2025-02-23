import { Timestamp } from '@/entities/timestamp';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import KtqPost from './ktq-post.entity';

@Entity('ktq_tags')
export default class KtqTag extends Timestamp {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @ManyToMany(() => KtqPost, (post) => post.tags)
  posts: KtqPost[];
}
