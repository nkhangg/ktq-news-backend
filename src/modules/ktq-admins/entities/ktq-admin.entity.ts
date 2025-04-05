import { Timestamp } from '@/entities/timestamp';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import KtqPermission from './ktq_permission.entity';
import KtqPost from '@/modules/ktq-posts/entities/ktq-post.entity';

@Entity('ktq_admins')
export default class KtqAdmin extends Timestamp {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  fullname: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'boolean', default: false })
  is_system_account: boolean;

  @ManyToMany(() => KtqPermission, (permission) => permission.admins, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  permissions: KtqPermission[];

  @OneToMany(() => KtqPost, (post) => post.admin)
  posts: KtqPost[];
}
