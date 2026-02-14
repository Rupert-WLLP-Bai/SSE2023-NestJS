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
@Unique(['courseId', 'experimentId'])
export class ExperimentWeight extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '课程ID' })
  courseId: number;

  @Column({ comment: '实验ID' })
  experimentId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '实验权重 (0-100)' })
  weight: number;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
