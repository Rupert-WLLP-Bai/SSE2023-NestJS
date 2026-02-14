import { Injectable, Logger } from '@nestjs/common';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';

@Injectable()
export class AppService {
  constructor(private readonly userService: UserService) {}
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  // 从header中的Authorization中获取token
  // 使用token获取用户信息
  // TODO 目前使用id作为token
  // 返回:Promise<User>
  getCurrentUser(token: string): Promise<User> {
    const res = this.userService.findOne(Number(token));
    return res;
  }
}
