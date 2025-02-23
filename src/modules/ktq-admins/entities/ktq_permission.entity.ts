import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import KtqAdmin from './ktq-admin.entity';

@Entity('ktq_permissions')
export default class KtqPermission {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ManyToMany(() => KtqAdmin, (admin) => admin.permissions)
  @JoinTable()
  admins: KtqAdmin[];
}
