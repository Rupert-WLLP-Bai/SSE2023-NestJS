import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TotalScore extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '课程ID' })
  courseId: number;

  @Column({ comment: '学生ID' })
  studentId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '总成绩' })
  totalScore: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: '实验成绩',
  })
  experimentScore: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: '考试成绩',
  })
  examinationScore: number;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
