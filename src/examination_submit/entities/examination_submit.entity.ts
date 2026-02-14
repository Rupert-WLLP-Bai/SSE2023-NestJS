/**
 * @file examination_submit.entity.ts
 * @description 考试提交实体
 * @author SSE Team
 * @version 1.0.0
 */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
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

  @Column({ nullable: true })
  examinationId: number;

  @Column({ nullable: true })
  studentId: number;

  @Column({ nullable: true })
  problemId: number;

  @Column({ nullable: true, type: 'text' })
  answer: string;

  @Column({
    type: 'int',
    nullable: true,
    default: SubmitStatus.NOT_SUBMITTED,
  })
  status: SubmitStatus;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true, type: 'text' })
  feedback: string;

  @Column({ nullable: true })
  submitTime: Date;

  @Column({ nullable: true })
  createTime: Date;

  @Column({ nullable: true })
  updateTime: Date;
}
