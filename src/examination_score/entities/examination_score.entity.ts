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
@Unique(['courseId', 'studentId', 'examinationId', 'problemId'])
export class ExaminationScore extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '课程ID' })
  courseId: number;

  @Column({ comment: '考试ID' })
  examinationId: number;

  @Column({ comment: '学生ID' })
  studentId: number;

  @Column({ comment: '题目ID' })
  problemId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '考试成绩' })
  score: number;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
