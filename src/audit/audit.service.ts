import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { AuditLog } from './entities/audit_log.entity';

export interface CreateAuditLogDto {
  userId?: number;
  userName?: string;
  operator?: string;
  targetType: string;
  targetId?: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface QueryAuditLogDto {
  userId?: number;
  targetType?: string;
  targetId?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(createAuditLogDto);
    return await this.auditLogRepository.save(auditLog);
  }

  async findAll(query: QueryAuditLogDto) {
    const {
      userId,
      targetType,
      targetId,
      action,
      startDate,
      endDate,
      page = 1,
      pageSize = 10,
    } = query;

    const whereConditions: any = {};

    if (userId) {
      whereConditions.userId = userId;
    }
    if (targetType) {
      whereConditions.targetType = targetType;
    }
    if (targetId) {
      whereConditions.targetId = targetId;
    }
    if (action) {
      whereConditions.action = action;
    }
    if (startDate && endDate) {
      whereConditions.createdAt = Between(
        new Date(startDate),
        new Date(endDate),
      );
    }

    const [list, total] = await this.auditLogRepository.findAndCount({
      where: whereConditions,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      list,
      total,
      current: page,
      pageSize,
    };
  }

  async findByTarget(
    targetType: string,
    targetId: number,
  ): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: { targetType, targetId },
      order: { createdAt: 'DESC' },
    });
  }
}
