import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginParams {
  @ApiProperty({ description: '用户名/学号', example: 2052538 })
  @IsNumber()
  id: number;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @MinLength(1)
  password: string;

  @ApiProperty({ description: '自动登录', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  autoLogin?: boolean;

  @ApiProperty({ description: '类型', example: 'admin', required: false })
  @IsOptional()
  @IsString()
  type?: string;
}
