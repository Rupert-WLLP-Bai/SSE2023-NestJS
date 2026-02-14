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
@Unique(['courseId', 'studentId', 'experimentId'])
export class ExperimentScore extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '课程ID' })
  courseId: number;

  @Column({ comment: '实验ID' })
  experimentId: number;

  @Column({ comment: '学生ID' })
  studentId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '实验成绩' })
  score: number;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
