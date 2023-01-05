import { Body, Controller, Post, Logger } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginResponse } from 'src/login/login.response';
import { LoginParams } from './dto/login';
import { LoginService } from './login.service';

@Controller('login')
@ApiTags('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // 登录
  @Post('account')
  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: LoginParams })
  async login(@Body() loginParams: LoginParams): Promise<LoginResponse> {
    Logger.debug('loginParams', JSON.stringify(loginParams));
    return await this.loginService.login(loginParams);
  }
}
