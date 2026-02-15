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
import { ExperimentScoreService } from './experiment_score.service';
import { CreateExperimentScoreDto } from './dto/create-experiment_score.dto';
import { UpdateExperimentScoreDto } from './dto/update-experiment_score.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../common/guards';
import { UserRole } from '../user/entities/user.entity';
import { AuditService } from '../audit/audit.service';

@ApiTags('experiment-score')
@ApiBearerAuth('JWT-auth')
@Controller('experiment-score')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExperimentScoreController {
  constructor(
    private readonly experimentScoreService: ExperimentScoreService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '创建实验成绩' })
  @ApiBody({ type: CreateExperimentScoreDto })
  @ApiResponse({ status: 201, description: '创建成功', type: NormalResponse })
  async create(
    @Body() createExperimentScoreDto: CreateExperimentScoreDto,
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
      response.data = await this.experimentScoreService.create(
        createExperimentScoreDto,
      );
      await this.auditService.create({
        userId: user?.id,
        userName: user?.username,
        operator: user?.username,
        targetType: 'ExperimentScore',
        targetId: response.data['id'],
        action: 'CREATE',
        newValue: createExperimentScoreDto,
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
  @ApiOperation({ summary: '获取所有实验成绩' })
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
      response.data.list = await this.experimentScoreService.findAll();
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
  @ApiOperation({ summary: '根据ID获取实验成绩' })
  @ApiParam({ name: 'id', description: '成绩ID', type: Number })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<QueryResponse> {
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
      const res = await this.experimentScoreService.findOne(id);
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
  @ApiOperation({ summary: '更新实验成绩' })
  @ApiParam({ name: 'id', description: '成绩ID', type: Number })
  @ApiBody({ type: UpdateExperimentScoreDto })
  @ApiResponse({ status: 200, description: '更新成功', type: UpdateResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExperimentScoreDto: UpdateExperimentScoreDto,
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
      const oldRecord = await this.experimentScoreService.findOne(id);
      const result = await this.experimentScoreService.update(
        id,
        updateExperimentScoreDto,
      );
      response.data = { raw: result, affected: 1, generatedMaps: [] };
      await this.auditService.create({
        userId: user?.id,
        userName: user?.username,
        operator: user?.username,
        targetType: 'ExperimentScore',
        targetId: id,
        action: 'UPDATE',
        oldValue: oldRecord,
        newValue: updateExperimentScoreDto,
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
  @ApiOperation({ summary: '删除实验成绩' })
  @ApiParam({ name: 'id', description: '成绩ID', type: Number })
  @ApiResponse({ status: 200, description: '删除成功', type: DeleteResponse })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponse> {
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
      response.data = await this.experimentScoreService.remove(id);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post('query')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: '通用查询实验成绩（支持分页）' })
  @ApiBody({ schema: { example: { page: 1, limit: 10, experimentId: 1 } } })
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
      const res = await this.experimentScoreService.findCommon(query);
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
  @ApiOperation({ summary: '创建或更新实验成绩 (upsert)' })
  @ApiBody({ type: CreateExperimentScoreDto })
  @ApiResponse({ status: 201, description: 'Upsert成功', type: NormalResponse })
  async upsert(
    @Body() createExperimentScoreDto: CreateExperimentScoreDto,
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
      const { courseId, studentId, experimentId } = createExperimentScoreDto;
      const existing = await this.experimentScoreService.findOneByCondition({
        courseId,
        studentId,
        experimentId,
      });
      const oldValue = existing || null;

      response.data = await this.experimentScoreService.upsert(
        createExperimentScoreDto,
      );
      await this.auditService.create({
        userId: user?.id,
        userName: user?.username,
        operator: user?.username,
        targetType: 'ExperimentScore',
        targetId: response.data['id'],
        action: existing ? 'UPDATE' : 'CREATE',
        oldValue,
        newValue: createExperimentScoreDto,
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
