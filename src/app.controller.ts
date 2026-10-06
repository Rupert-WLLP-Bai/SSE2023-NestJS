import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService, HealthStatus } from './app.service';
import { NormalResponse } from './common/response/response.interface';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { CurrentUser, JwtUser } from './common/guards/current-user.decorator';
import { fail, ok } from './common/response/response.factory';

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

  @Get('currentUser')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前用户信息' })
  async getCurrentUser(@CurrentUser() user: JwtUser): Promise<NormalResponse> {
    const res = await this.appService.getCurrentUser(user.id);
    if (!res) {
      return fail('USER_NOT_FOUND', '用户不存在', 1, res);
    }
    return ok(res);
  }
}
