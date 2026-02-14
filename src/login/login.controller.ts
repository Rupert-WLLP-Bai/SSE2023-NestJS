import { NormalResponse } from './../common/response/response.interface';
import { Body, Controller, Post, Logger, Get } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { UseGuards } from '@nestjs/common';
import { LoginResponse } from 'src/login/login.response';
import { LoginParams } from './dto/login';
import { LoginService } from './login.service';

@Controller('login')
@ApiTags('login')
@UseGuards(ThrottlerGuard)
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // 登录 - 限流：每 IP 每分钟 5 次
  @Post('account')
  @Throttle({ login: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: LoginParams })
  async login(@Body() loginParams: LoginParams): Promise<LoginResponse> {
    Logger.debug('loginParams', JSON.stringify(loginParams));
    return await this.loginService.login(loginParams);
  }

  //登出
  @Get('outlogin')
  @ApiOperation({ summary: '登出' })
  async outlogin(): Promise<NormalResponse> {
    return await this.loginService.outlogin();
  }
}
