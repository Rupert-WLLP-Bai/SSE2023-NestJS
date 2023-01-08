import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
/**
 * @file - Notice Entity
 * @description - Notice Entity
 * @author - Junhao Bai
 * @version - 1.0.0
 */
@Entity('notice')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  title: string;
  @Column({ nullable: true })
  content: string;
  @Column({ nullable: true })
  publishDate: Date;
  @Column({ nullable: true })
  publisherId: number;
  @Column({ nullable: true })
  publisher: string;
}
