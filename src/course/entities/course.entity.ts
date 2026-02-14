import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  teacherId: number;

  @Column({ nullable: true })
  teacherName: string;

  @Column({ nullable: true })
  credit: number;

  @Column()
  createTime: Date;

  @Column()
  updateTime: Date;
}
