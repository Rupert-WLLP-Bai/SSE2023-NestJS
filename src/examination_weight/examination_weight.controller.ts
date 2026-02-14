import {
  QueryResponse,
  NormalResponse,
  UpdateResponse,
  DeleteResponse,
} from '../common/response/response.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ExaminationWeightService } from './examination_weight.service';
import { CreateExaminationWeightDto } from './dto/create-examination_weight.dto';
import { UpdateExaminationWeightDto } from './dto/update-examination_weight.dto';
import { JwtAuthGuard, CurrentUser } from '../common/guards';
import { AuditService } from '../audit/audit.service';

@ApiTags('examination-weight')
@ApiBearerAuth('JWT-auth')
@Controller('examination-weight')
@UseGuards(JwtAuthGuard)
export class ExaminationWeightController {
  constructor(
    private readonly examinationWeightService: ExaminationWeightService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @ApiOperation({ summary: '创建考试权重' })
  @ApiBody({ type: CreateExaminationWeightDto })
  @ApiResponse({ status: 201, description: '创建成功', type: NormalResponse })
  async create(
    @Body() createExaminationWeightDto: CreateExaminationWeightDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ): Promise<NormalResponse> {
    const response: NormalResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      response.data = await this.examinationWeightService.create(
        createExaminationWeightDto,
      );
      await this.auditService.create({
        userId: user?.id,
        userName: user?.username,
        operator: user?.username,
        targetType: 'ExaminationWeight',
        targetId: response.data['id'],
        action: 'CREATE',
        newValue: createExaminationWeightDto,
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: '获取所有考试权重' })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async findAll(): Promise<QueryResponse> {
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
      response.data.list = await this.examinationWeightService.findAll();
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID获取考试权重' })
  @ApiParam({ name: 'id', description: '权重ID', type: Number })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<QueryResponse> {
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
      const res = await this.examinationWeightService.findOne(id);
      response.data.list = res ? [res] : [];
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新考试权重' })
  @ApiParam({ name: 'id', description: '权重ID', type: Number })
  @ApiBody({ type: UpdateExaminationWeightDto })
  @ApiResponse({ status: 200, description: '更新成功', type: UpdateResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExaminationWeightDto: UpdateExaminationWeightDto,
    @CurrentUser() user: any,
    @Req() req: any,
  ): Promise<UpdateResponse> {
    const response: UpdateResponse = {
      success: true,
      data: { raw: [], affected: 0, generatedMaps: [] },
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      const oldRecord = await this.examinationWeightService.findOne(id);
      const result = await this.examinationWeightService.update(
        id,
        updateExaminationWeightDto,
      );
      response.data = { raw: result, affected: 1, generatedMaps: [] };
      await this.auditService.create({
        userId: user?.id,
        userName: user?.username,
        operator: user?.username,
        targetType: 'ExaminationWeight',
        targetId: id,
        action: 'UPDATE',
        oldValue: oldRecord,
        newValue: updateExaminationWeightDto,
        ipAddress: req.ip || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],
      });
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除考试权重' })
  @ApiParam({ name: 'id', description: '权重ID', type: Number })
  @ApiResponse({ status: 200, description: '删除成功', type: DeleteResponse })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResponse> {
    const response: DeleteResponse = {
      success: true,
      data: { raw: [], affected: 0 },
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      response.data = await this.examinationWeightService.remove(id);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post('query')
  @ApiOperation({ summary: '通用查询考试权重（支持分页）' })
  @ApiBody({ schema: { example: { page: 1, limit: 10, courseId: 1 } } })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async findCommon(@Body() query: any): Promise<QueryResponse> {
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
      const res = await this.examinationWeightService.findCommon(query);
      response.success = true;
      response.data.list = res[0];
      response.data.total = res[1];
      response.data.current = query.page || 1;
      response.data.pageSize = query.limit || 10;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }
}
