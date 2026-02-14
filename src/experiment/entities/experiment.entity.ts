/**
 * @file experiment.entity.ts
 * @description 实验实体
 * @author Junhao Bai
 * @version 1.0.0
 * @date 2023-01-08
 */
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Experiment extends BaseEntity {
  // id
  @PrimaryGeneratedColumn()
  id: number;
  // 实验名称
  @Column({ nullable: true })
  title: string;
  // 实验发布者id
  @Column({ nullable: true })
  publisherId: number;
  // 实验发布者名称
  @Column({ nullable: true })
  publisherName: string;
  // 实验描述
  @Column({ nullable: true })
  description: string;
  // 课程ID
  @Column({ nullable: true })
  courseId: number;
  // 实验状态
  @Column({ nullable: true })
  status: number;
  // 实验开始时间
  @Column({ nullable: true })
  startTime: Date;
  // 实验结束时间
  @Column({ nullable: true })
  endTime: Date;
  // 实验创建时间
  @Column({ nullable: true })
  createTime: Date;
  // 实验更新时间
  @Column({ nullable: true })
  updateTime: Date;
}
