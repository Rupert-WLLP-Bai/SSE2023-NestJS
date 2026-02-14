import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
