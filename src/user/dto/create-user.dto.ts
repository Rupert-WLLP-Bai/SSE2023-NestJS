import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户id', example: 2052526, nullable: true })
  id: number;
  @ApiProperty({ description: '姓名', example: '张三', nullable: true })
  name?: string;
  @ApiProperty({ description: '密码', example: '123456', nullable: true })
  password?: string;
  @ApiProperty({ description: '邮箱', example: 'test@qq.com', nullable: true })
  email?: string;
  @ApiProperty({
    description: '手机号',
    example: '178308xxxxx',
    nullable: true,
  })
  phone?: string;
  @ApiProperty({ description: '用户状态', example: 1, nullable: true })
  status?: number;
  @ApiProperty({ description: '用户角色', example: 1, nullable: true })
  role?: number;
  @ApiProperty({
    description: '创建时间',
    example: '2021-01-01 00:00:00',
    nullable: true,
  })
  create_time?: Date;
  @ApiProperty({
    description: '更新时间',
    example: '2021-01-01 00:00:00',
    nullable: true,
  })
  update_time: Date;
  @ApiProperty({
    description: '最后登录时间',
    example: '2021-01-01 00:00:00',
    nullable: true,
  })
  last_login_time?: Date;
  @ApiProperty({
    description: '最后登录ip',
    example: '183.12.3.144',
    nullable: true,
  })
  ip?: string;
}
