/**
 * @file examination.entity.ts
 * @description 考试实体
 * @author SSE Team
 * @version 1.0.0
 */
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum ExaminationStatus {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  FINISHED = 2,
  ARCHIVED = 3,
}

export enum ExaminationType {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Entity()
export class Examination extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  courseId: number;

  @Column({ nullable: true })
  courseName: string;

  @Column({ nullable: true })
  publisherId: number;

  @Column({ nullable: true })
  publisherName: string;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  totalScore: number;

  @Column({ nullable: true })
  passingScore: number;

  @Column({
    type: 'int',
    nullable: true,
    default: ExaminationStatus.NOT_STARTED,
  })
  status: ExaminationStatus;

  @Column({
    type: 'varchar',
    nullable: true,
    default: ExaminationType.ONLINE,
  })
  type: ExaminationType;

  @Column({ nullable: true })
  createTime: Date;

  @Column({ nullable: true })
  updateTime: Date;
}
