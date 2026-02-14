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
@Unique(['courseId', 'examinationId'])
export class ExaminationWeight extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '课程ID' })
  courseId: number;

  @Column({ comment: '考试ID' })
  examinationId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '考试权重 (0-100)' })
  weight: number;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
