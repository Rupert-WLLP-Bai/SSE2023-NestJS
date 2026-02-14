import { QueryResponse } from '../common/response/response.interface';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuditService, QueryAuditLogDto } from './audit.service';
import { JwtAuthGuard, RolesGuard, Roles } from '../common/guards';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '查询审计日志' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'targetType', required: false })
  @ApiQuery({ name: 'targetId', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  async findAll(@Query() query: QueryAuditLogDto): Promise<QueryResponse> {
    const response: QueryResponse = {
      success: true,
      data: { list: [], total: 0, current: 1, pageSize: 10 },
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      const result = await this.auditService.findAll(query);
      response.data.list = result.list;
      response.data.total = result.total;
      response.data.current = result.current;
      response.data.pageSize = result.pageSize;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }
}
