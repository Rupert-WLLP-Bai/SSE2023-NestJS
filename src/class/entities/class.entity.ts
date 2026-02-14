import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Class extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  courseId: number;

  @Column({ nullable: true })
  teacherId: number;

  @Column({ nullable: true })
  teacherName: string;

  @Column({ nullable: true })
  semester: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  maxStudents: number;

  @Column({ default: 0 })
  currentStudents: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  createTime: Date;

  @Column()
  updateTime: Date;
}
