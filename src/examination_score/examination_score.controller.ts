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
import { ExaminationScoreService } from './examination_score.service';
import { CreateExaminationScoreDto } from './dto/create-examination_score.dto';
import { UpdateExaminationScoreDto } from './dto/update-examination_score.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../common/guards';
import { UserRole } from '../user/entities/user.entity';
import { AuditService } from '../audit/audit.service';

@ApiTags('examination-score')
@ApiBearerAuth('JWT-auth')
@Controller('examination-score')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExaminationScoreController {
  constructor(
    private readonly examinationScoreService: ExaminationScoreService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '创建考试成绩' })
  @ApiBody({ type: CreateExaminationScoreDto })
  @ApiResponse({ status: 201, description: '创建成功', type: NormalResponse })
  async create(
    @Body() createExaminationScoreDto: CreateExaminationScoreDto,
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
      response.data = await this.examinationScoreService.create(
        createExaminationScoreDto,
      );
      // 记录审计日志
      await this.auditService.create({
        userId: user?.id,
        userName: user?.username,
        operator: user?.username,
        targetType: 'ExaminationScore',
        targetId: response.data['id'],
        action: 'CREATE',
        newValue: createExaminationScoreDto,
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
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '获取所有考试成绩' })
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
      response.data.list = await this.examinationScoreService.findAll();
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: '根据ID获取考试成绩' })
  @ApiParam({ name: 'id', description: '成绩ID', type: Number })
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
      const res = await this.examinationScoreService.findOne(id);
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
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '更新考试成绩' })
  @ApiParam({ name: 'id', description: '成绩ID', type: Number })
  @ApiBody({ type: UpdateExaminationScoreDto })
  @ApiResponse({ status: 200, description: '更新成功', type: UpdateResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExaminationScoreDto: UpdateExaminationScoreDto,
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
      // 获取更新前的数据
      const oldRecord = await this.examinationScoreService.findOne(id);
      const result = await this.examinationScoreService.update(
        id,
        updateExaminationScoreDto,
      );
      response.data = { raw: result, affected: 1, generatedMaps: [] };
      // 记录审计日志
      await this.auditService.create({
        userId: user?.id,
        userName: user?.username,
        operator: user?.username,
        targetType: 'ExaminationScore',
        targetId: id,
        action: 'UPDATE',
        oldValue: oldRecord,
        newValue: updateExaminationScoreDto,
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
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: '删除考试成绩' })
  @ApiParam({ name: 'id', description: '成绩ID', type: Number })
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
      response.data = await this.examinationScoreService.remove(id);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post('query')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: '通用查询考试成绩（支持分页）' })
  @ApiBody({ schema: { example: { page: 1, limit: 10, examinationId: 1 } } })
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
      const res = await this.examinationScoreService.findCommon(query);
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

  @Post('upsert')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '创建或更新考试成绩 (upsert)' })
  @ApiBody({ type: CreateExaminationScoreDto })
  @ApiResponse({ status: 201, description: 'Upsert成功', type: NormalResponse })
  async upsert(
    @Body() createExaminationScoreDto: CreateExaminationScoreDto,
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
      // 检查是否存在
      const { courseId, studentId, examinationId, problemId } = createExaminationScoreDto;
      const existing = await this.examinationScoreService.findOneByCondition({
        courseId, studentId, examinationId, problemId,
      });
      const oldValue = existing || null;

      response.data = await this.examinationScoreService.upsert(
        createExaminationScoreDto,
      );
      // 记录审计日志
      await this.auditService.create({
        userId: user?.id,
        userName: user?.username,
        operator: user?.username,
        targetType: 'ExaminationScore',
        targetId: response.data['id'],
        action: existing ? 'UPDATE' : 'CREATE',
        oldValue,
        newValue: createExaminationScoreDto,
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
}
