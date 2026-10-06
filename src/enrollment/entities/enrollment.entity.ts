import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['studentId', 'courseId'])
export class Enrollment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column({ nullable: true })
  studentName: string;

  @Column()
  classId: number;

  @Column({ nullable: true })
  className: string;

  @Column({ nullable: true })
  courseId: number;

  @Column({ nullable: true })
  courseName: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  enrollmentDate: Date;

  @Column({ nullable: true })
  dropDate: Date;

  @Column({ nullable: true })
  grade: number;

  @Column({ nullable: true })
  comment: string;

  @Column()
  createTime: Date;

  @Column()
  updateTime: Date;
}
