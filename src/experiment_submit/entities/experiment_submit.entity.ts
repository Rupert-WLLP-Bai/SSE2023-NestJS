/**
 * @file Experiment Submit Entity
 * @description 学生实验提交实体
 * @author Junhao Bai
 * @version 1.0
 * @date 2023/01/15
 */

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ExperimentSubmit {
  @PrimaryGeneratedColumn()
  id?: number; // 实验提交ID
  @Column()
  experimentId?: number; // 实验ID
  @Column()
  studentId?: number; // 学生ID
  @Column({ type: 'bigint' })
  timeStamp?: bigint; // 时间戳
  @Column({ type: 'bytea', nullable: true })
  file?: Express.Multer.File; // 文件
  @Column({ nullable: true })
  fileName?: string; // 文件名
  @Column({ nullable: true })
  fileSize?: number; // 文件大小
  @Column({ nullable: true })
  mineType?: string; // 文件类型
  @Column({ nullable: true })
  fieldname?: string; // 文件字段名
  @Column({ nullable: true })
  encoding?: string; // 文件编码
  @Column({ nullable: true })
  fileUrl?: string; // 文件URL
}
