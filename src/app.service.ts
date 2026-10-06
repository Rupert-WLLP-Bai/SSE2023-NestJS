import { Injectable } from '@nestjs/common';
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
    } catch {
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

  getCurrentUser(userId: number): Promise<User> {
    return this.userService.findOne(userId);
  }
}
