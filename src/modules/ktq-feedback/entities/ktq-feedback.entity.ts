import { Timestamp } from '@/entities/timestamp';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ktq_feedbacks')
export class KtqFeedback extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  fullname: string;

  @Column({ type: 'varchar' })
  message: string;
}
