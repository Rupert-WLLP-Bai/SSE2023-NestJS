import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['courseId'])
export class TotalWeight extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  experimentWeight: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  examinationWeight: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
