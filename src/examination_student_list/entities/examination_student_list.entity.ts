/**
 * @file examination_student_list.entity.ts
 * @description 考试学生列表实体
 * @author SSE Team
 * @version 1.0.0
 */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StudentStatus {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  SUBMITTED = 2,
  GRADED = 3,
}

@Entity()
export class ExaminationStudentList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  examinationId: number;

  @Column({ nullable: true })
  studentId: number;

  @Column({ nullable: true })
  studentName: string;

  @Column({ nullable: true })
  studentNumber: string;

  @Column({
    type: 'int',
    nullable: true,
    default: StudentStatus.NOT_STARTED,
  })
  status: StudentStatus;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ nullable: true })
  createTime: Date;

  @Column({ nullable: true })
  updateTime: Date;
}
