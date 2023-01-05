import { ApiProperty } from '@nestjs/swagger';

export class LoginParams {
  @ApiProperty({ description: '用户名', example: '2052538' })
  id?: number;
  @ApiProperty({ description: '密码', example: '123456' })
  password?: string;
  @ApiProperty({ description: '自动登录', example: 'true' })
  autoLogin?: boolean;
  @ApiProperty({ description: '类型', example: 'admin' })
  type?: string;
}
