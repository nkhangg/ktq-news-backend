import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { EAuthProvider } from '../enum/auth-provider.enum';
import { KtqUser } from './ktq-user.entity';
import { Timestamp } from '@/entities/timestamp';
import { Exclude } from 'class-transformer';

@Entity({ name: 'ktq_user_authentications' })
export class KtqUserAuthentication extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => KtqUser, (user) => user.authentications, {
    onDelete: 'CASCADE',
  })
  user: KtqUser;

  @Column({ type: 'enum', enum: EAuthProvider })
  provider: EAuthProvider;

  @Column({ nullable: true })
  provider_id: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;
}
