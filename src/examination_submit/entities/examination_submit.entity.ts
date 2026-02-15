import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SubmitStatus {
  NOT_SUBMITTED = 0,
  SUBMITTED = 1,
  GRADED = 2,
}

@Entity()
export class ExaminationSubmit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '考试ID' })
  examinationId: number;

  @Column({ comment: '学生ID' })
  studentId: number;

  @Column({ comment: '题目ID' })
  problemId: number;

  @Column({ type: 'text', nullable: true, comment: '答案' })
  answer: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '文件URL' })
  fileUrl: string;

  @Column({
    type: 'int',
    nullable: true,
    default: SubmitStatus.NOT_SUBMITTED,
    comment: '提交状态: 0-未提交, 1-已提交, 2-已批改',
  })
  status: SubmitStatus;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: '分数',
  })
  score: number;

  @Column({ type: 'text', nullable: true, comment: '反馈' })
  feedback: string;

  @Column({ type: 'datetime', nullable: true, comment: '提交时间' })
  submitTime: Date;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
