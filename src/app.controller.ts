import { Controller, Get, Headers, Logger, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from './common/response/response.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 从header中的Authorization中获取token
  // 使用token获取用户信息
  // TODO 目前使用id作为token
  // 返回data类型: Promise<User>
  @Get('currentUser')
  async getCurrentUser(@Req() req): Promise<Response> {
    const token = req.headers.authorization;
    Logger.debug('token: ' + token);
    const res = await this.appService.getCurrentUser(token);
    const response: Response = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    // 如果没查询到，说明token不正确
    if (!res) {
      response.success = false;
      response.errorMessage = 'token不正确';
      response.data = res;
      return response;
    }
    // 如果查询到了，返回用户信息
    response.data = res;
    return response;
  }
}
