import { Timestamp } from '@/entities/timestamp';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MediaType {
  'IMAGE' = 'image',
  'VIDEO' = 'video',
}

@Entity('ktq_medias')
export default class KtqMedia extends Timestamp {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  @Transform(({ obj }) => {
    return `${process.env.APP_PATH}/client-medias/${obj.name}`;
  })
  path: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  original_path: string | null;

  @Column({ type: 'enum', enum: MediaType, default: MediaType.IMAGE })
  media_type: MediaType;
}
