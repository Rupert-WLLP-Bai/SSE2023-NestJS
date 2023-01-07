import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../entities/user.entity';

export class UserFilter {
  @ApiProperty({ description: '用户id', example: 2052526, nullable: true })
  id?: number;
  @ApiProperty({ description: '用户名', example: 'admin', nullable: true })
  name?: string;
  @ApiProperty({
    description: '邮箱',
    example: 'test@gmail.com',
    nullable: true,
  })
  email?: string;
  @ApiProperty({
    description: '手机号',
    example: '12345678901',
    nullable: true,
  })
  phone?: string;
  @ApiProperty({
    description: '用户状态',
    example: UserStatus.DISABLE,
    enum: [UserStatus.DISABLE, UserStatus.ENABLE],
    nullable: true,
  })
  status?: UserStatus;
  @ApiProperty({
    description: '用户角色',
    example: UserRole.ADMIN,
    enum: [
      UserRole.ADMIN,
      UserRole.STUDENT,
      UserRole.TEACHER,
      UserRole.ASSISTANT,
    ],
    nullable: true,
  })
  role?: UserRole;
  @ApiProperty({
    description: '创建时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  create_time?: Date;
  @ApiProperty({
    description: '更新时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  update_time?: Date;
  @ApiProperty({
    description: '最后登录时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  last_login_time?: Date;
  @ApiProperty({
    description: '登录ip',
    example: '119.3.154.46',
    nullable: true,
  })
  ip?: string;
}

export class QueryUserDto {
  // 1. 分页
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  page?: number;
  @ApiProperty({ description: '每页数量', example: 10, nullable: true })
  limit?: number;
  // 2. 排序
  @ApiProperty({
    description: '排序字段',
    example: 'id',
    enum: [
      'id',
      'name',
      'email',
      'phone',
      'status',
      'role',
      'create_time',
      'update_time',
      'last_login_time',
      'ip',
    ],
    nullable: true,
  })
  sort?: string;
  @ApiProperty({
    description: '排序方式',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    nullable: true,
  })
  order?: 'ASC' | 'DESC';
  // 3. 过滤
  @ApiProperty({
    type: UserFilter,
    description: '过滤字段',
    example: '{"id": 2052526}',
    nullable: true,
  })
  filter?: UserFilter;
}
