import { Timestamp } from '@/entities/timestamp';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import KtqPost from './ktq-post.entity';
import { Expose } from 'class-transformer';

@Entity('ktq_categories')
export default class KtqCategory extends Timestamp {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  description: string | null;

  @OneToMany(() => KtqPost, (post) => post.category)
  posts: KtqPost[];

  @Expose()
  get post_count(): number {
    return this.posts?.length || 0;
  }
}
