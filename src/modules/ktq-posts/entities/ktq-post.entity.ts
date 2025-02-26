import { Timestamp } from '@/entities/timestamp';
import KtqAdmin from '@/modules/ktq-admins/entities/ktq-admin.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import KtqCategory from './ktq-category.entity';
import { KtqLike } from './ktq-like.entity';
import { KtqSearchHistory } from './ktq-search-histories.entity';
import KtqTag from './ktq-tag.entity';
import { KtqHistory } from './ktq-history.entity';

@Entity('ktq_posts')
export default class KtqPost extends Timestamp {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  thumbnail: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index()
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'text', nullable: true })
  preview_content?: string;

  @ManyToOne(() => KtqAdmin, (user) => user.posts, { nullable: false })
  admin: KtqAdmin;

  @ManyToOne(() => KtqCategory, (category) => category.posts, {
    nullable: false,
    cascade: ['insert', 'update'],
  })
  category: KtqCategory;

  @ManyToMany(() => KtqTag, (tag) => tag.posts, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  tags: KtqTag[];

  @Column({ type: 'int', default: 300 })
  ttr: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index()
  slug: string;

  @Column({ type: 'int', default: 0 })
  like_count: number;

  @OneToMany(() => KtqSearchHistory, (searchHistory) => searchHistory.post, {
    cascade: true,
  })
  searchHistories: KtqSearchHistory[];

  @OneToMany(() => KtqLike, (like) => like.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  likes: KtqLike[];

  @OneToMany(() => KtqHistory, (history) => history.post, { cascade: true })
  histories: KtqHistory[];
}
