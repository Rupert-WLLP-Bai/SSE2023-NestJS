import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户id', example: 2052526, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  @ApiProperty({ description: '姓名', example: '张三' })
  @IsNotEmpty({ message: '姓名不能为空' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ description: '邮箱', example: 'test@qq.com', nullable: true })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiProperty({
    description: '手机号',
    example: '178308xxxxx',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ description: '用户状态', example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  status?: number;

  @ApiProperty({ description: '用户角色', example: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  role?: number;

  @ApiProperty({
    description: '创建时间',
    example: '2021-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @IsDateString({}, { message: '创建时间格式不正确' })
  create_time?: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2021-01-01 00:00:00',
  })
  @IsOptional()
  @IsDateString({}, { message: '更新时间格式不正确' })
  update_time?: Date;

  @ApiProperty({
    description: '最后登录时间',
    example: '2021-01-01 00:00:00',
    nullable: true,
  })
  @IsOptional()
  @IsDateString({}, { message: '最后登录时间格式不正确' })
  last_login_time?: Date;

  @ApiProperty({
    description: '最后登录ip',
    example: '183.12.3.144',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ip?: string;
}
