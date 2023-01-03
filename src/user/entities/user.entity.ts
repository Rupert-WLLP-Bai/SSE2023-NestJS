import { Column, Entity } from 'typeorm';

@Entity()
export class User {
  // 用户学号
  @Column({ primary: true })
  id: number;
  // 姓名
  @Column({ nullable: true })
  name: string;
  // 密码 sha256
  @Column({ nullable: true })
  password: string;
  // 邮箱
  @Column({ nullable: true })
  email: string;
  // 手机号
  @Column({ nullable: true })
  phone: string;
  // 用户状态 0:禁用 1:启用
  @Column({ nullable: true })
  status: number;
  // 用户角色 0:管理员 1:学生 2:教师 3:助教
  @Column({ nullable: true })
  role: number;
  // 创建时间
  @Column({ nullable: true })
  create_time: Date;
  // 更新时间
  @Column({ nullable: true })
  update_time: Date;
  // 最后登录时间
  @Column({ nullable: true })
  last_login_time: Date;
  // 最后登录ip
  @Column({ nullable: true })
  last_login_ip: string;
}
