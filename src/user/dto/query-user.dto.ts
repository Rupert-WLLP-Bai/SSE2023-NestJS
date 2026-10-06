import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { UserRole, UserStatus } from '../entities/user.entity';

export class UserFilter {
  @ApiProperty({ description: '用户id', example: 2052526, nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number;
  @ApiProperty({ description: '用户名', example: 'admin', nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({
    description: '邮箱',
    example: 'test@gmail.com',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  email?: string;
  @ApiProperty({
    description: '手机号',
    example: '12345678901',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  phone?: string;
  @ApiProperty({
    description: '用户状态',
    example: UserStatus.DISABLE,
    enum: [UserStatus.DISABLE, UserStatus.ENABLE],
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
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
  @IsOptional()
  @IsNumber()
  role?: UserRole;
  @ApiProperty({
    description: '创建时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  create_time?: Date;
  @ApiProperty({
    description: '更新时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  update_time?: Date;
  @ApiProperty({
    description: '最后登录时间',
    example: '2020-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  last_login_time?: Date;
  @ApiProperty({
    description: '登录ip',
    example: '119.3.154.46',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  ip?: string;
}

export class QueryUserDto {
  // 1. 分页
  @ApiProperty({ description: '页码', example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  page?: number;
  @ApiProperty({ description: '每页数量', example: 10, nullable: true })
  @IsOptional()
  @IsNumber()
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
  @IsOptional()
  @IsString()
  sort?: string;
  @ApiProperty({
    description: '排序方式',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    nullable: true,
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
  // 3. 过滤
  @ApiProperty({
    type: UserFilter,
    description: '过滤字段',
    example: '{"id": 2052526}',
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserFilter)
  filter?: UserFilter;
}
