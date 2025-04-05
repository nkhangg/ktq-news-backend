import { Timestamp } from '@/entities/timestamp';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { KtqUserAuthentication } from './ktq-user-authentication.entity';
import { KtqTokenBlackList } from './ktq-token-black-lists.entity';

@Entity({ name: 'ktq_users' })
export class KtqUser extends Timestamp {
  public static table_name = 'ktq_users';

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  display_name: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => KtqUserAuthentication, (auth) => auth.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  authentications: KtqUserAuthentication[];

  @OneToMany(() => KtqTokenBlackList, (blackList) => blackList.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  blackLists: KtqTokenBlackList[];
}
