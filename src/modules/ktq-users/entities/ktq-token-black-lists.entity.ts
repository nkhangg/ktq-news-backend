import { Timestamp } from '@/entities/timestamp';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { KtqUser } from './ktq-user.entity';

@Entity({ name: 'ktq_token_black_lists' })
export class KtqTokenBlackList extends Timestamp {
  public static table_name = 'ktq_token_black_lists';

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  token: string;

  @Column({ nullable: true, default: null })
  expires_at: Date | null;

  @ManyToOne(() => KtqUser, (user) => user.blackLists, { onDelete: 'CASCADE' })
  user: KtqUser;
}
