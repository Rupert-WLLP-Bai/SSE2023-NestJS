import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'user_name', nullable: true })
  userName: string;

  @Column({ name: 'operator', nullable: true })
  operator: string;

  @Column({ name: 'target_type', length: 100 })
  targetType: string;

  @Column({ name: 'target_id', nullable: true })
  targetId: number;

  @Column({ length: 50 })
  action: string;

  @Column({ name: 'old_value', type: 'jsonb', nullable: true })
  oldValue: Record<string, any>;

  @Column({ name: 'new_value', type: 'jsonb', nullable: true })
  newValue: Record<string, any>;

  @Column({ name: 'ip_address', length: 50, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
