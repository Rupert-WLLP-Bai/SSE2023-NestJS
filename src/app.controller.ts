import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Headers, Logger, Req } from '@nestjs/common';
import { AppService, HealthStatus } from './app.service';
import { NormalResponse } from './common/response/response.interface';

@Controller()
@ApiTags('通用')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Hello World' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health Check' })
  async getHealth(): Promise<HealthStatus> {
    return this.appService.getHealth();
  }

  // 从header中的Authorization中获取token
  // 使用token获取用户信息
  // TODO 目前使用id作为token
  // 返回data类型: Promise<User>
  @Get('currentUser')
  @ApiOperation({ summary: '获取当前用户信息' })
  async getCurrentUser(@Req() req): Promise<NormalResponse> {
    const token = req.headers.authorization;
    Logger.debug('token: ' + token);
    const res = await this.appService.getCurrentUser(token);
    const response: NormalResponse = {
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
