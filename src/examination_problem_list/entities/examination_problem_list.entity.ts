/**
 * @file examination_problem_list.entity.ts
 * @description 考试题目列表实体
 * @author SSE Team
 * @version 1.0.0
 */
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ProblemType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  CODE = 'code',
}

@Entity()
export class ExaminationProblemList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  examinationId: number;

  @Column({ nullable: true })
  problemId: number;

  @Column({ nullable: true })
  problemTitle: string;

  @Column({ nullable: true, type: 'text' })
  problemContent: string;

  @Column({ nullable: true })
  problemScore: number;

  @Column({
    type: 'varchar',
    nullable: true,
    default: ProblemType.SINGLE_CHOICE,
  })
  problemType: ProblemType;

  @Column({ nullable: true })
  problemOrder: number;

  @Column({ nullable: true, type: 'text' })
  answer: string;

  @Column({ nullable: true })
  createTime: Date;

  @Column({ nullable: true })
  updateTime: Date;
}
