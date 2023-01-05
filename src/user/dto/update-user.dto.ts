import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '姓名', example: '张三' })
  name?: string;
  @ApiProperty({ description: '密码', example: '123456' })
  password?: string;
  @ApiProperty({ description: '邮箱', example: 'test@qq.com' })
  email?: string;
  @ApiProperty({ description: '手机号', example: '178308xxxxx' })
  phone?: string;
  @ApiProperty({ description: '用户状态', example: 1 })
  status?: number;
  @ApiProperty({ description: '用户角色', example: 1 })
  role?: number;
  @ApiProperty({ description: '创建时间', example: '2021-01-01 00:00:00' })
  create_time?: Date;
  @ApiProperty({ description: '更新时间', example: '2021-01-01 00:00:00' })
  update_time?: Date;
  @ApiProperty({ description: '最后登录时间', example: '2021-01-01 00:00:00' })
  last_login_time?: Date;
  @ApiProperty({ description: '最后登录ip', example: '183.12.3.144' })
  ip?: string;
}
