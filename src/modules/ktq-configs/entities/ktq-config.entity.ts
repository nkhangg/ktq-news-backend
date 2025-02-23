import { Timestamp } from '@/entities/timestamp';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ConfigValueType {
  STRING = 'string',
  NUMBER = 'number',
  JSON = 'json',
}

@Entity('ktq_configs')
export class KtqConfig extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  key_name: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'enum', enum: ConfigValueType })
  type: ConfigValueType;
}
