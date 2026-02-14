import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { UserService } from './user/user.service';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  database: {
    status: 'up' | 'down';
    latency?: number;
  };
}

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getHealth(): Promise<HealthStatus> {
    const start = Date.now();
    let dbStatus: 'up' | 'down' = 'up';
    let latency: number | undefined;

    try {
      await this.dataSource.query('SELECT 1');
      latency = Date.now() - start;
    } catch (error) {
      dbStatus = 'down';
    }

    return {
      status: dbStatus === 'up' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        latency,
      },
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
