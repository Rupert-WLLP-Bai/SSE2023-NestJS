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
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ExaminationSubmitService } from './examination_submit.service';
import { CreateExaminationSubmitDto } from './dto/create-examination_submit.dto';
import { UpdateExaminationSubmitDto } from './dto/update-examination_submit.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../common/guards';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('examination-submit')
@ApiBearerAuth('JWT-auth')
@Controller('examination-submit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExaminationSubmitController {
  constructor(
    private readonly examinationSubmitService: ExaminationSubmitService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: '创建考试提交（含窗口校验）' })
  @ApiBody({ type: CreateExaminationSubmitDto })
  @ApiResponse({ status: 201, description: '创建成功', type: NormalResponse })
  async create(
    @Body() createExaminationSubmitDto: CreateExaminationSubmitDto,
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
      // 使用带窗口校验的创建方法
      response.data = await this.examinationSubmitService.createWithValidation(
        createExaminationSubmitDto,
      );
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post(':examinationId/student/:studentId/problem/:problemId/mark-graded')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '标记提交为已评分（评分成功后调用）' })
  @ApiParam({ name: 'examinationId', description: '考试ID', type: Number })
  @ApiParam({ name: 'studentId', description: '学生ID', type: Number })
  @ApiParam({ name: 'problemId', description: '题目ID', type: Number })
  @ApiResponse({ status: 200, description: '更新成功', type: NormalResponse })
  async markAsGraded(
    @Param('examinationId', ParseIntPipe) examinationId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('problemId', ParseIntPipe) problemId: number,
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
      // 先验证是否已提交
      await this.examinationSubmitService.validateSubmitted(examinationId, studentId, problemId);
      // 更新状态为已评分
      response.data = await this.examinationSubmitService.markAsGraded(examinationId, studentId, problemId);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '获取所有考试提交' })
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
      response.data.list = await this.examinationSubmitService.findAll();
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
  @ApiOperation({ summary: '根据ID获取考试提交' })
  @ApiParam({ name: 'id', description: '提交记录ID', type: Number })
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
      const res = await this.examinationSubmitService.findOne(id);
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
  @ApiOperation({ summary: '更新考试提交' })
  @ApiParam({ name: 'id', description: '提交记录ID', type: Number })
  @ApiBody({ type: UpdateExaminationSubmitDto })
  @ApiResponse({ status: 200, description: '更新成功', type: UpdateResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExaminationSubmitDto: UpdateExaminationSubmitDto,
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
      const result = await this.examinationSubmitService.update(
        id,
        updateExaminationSubmitDto,
      );
      response.data = { raw: result, affected: 1, generatedMaps: [] };
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: '删除考试提交' })
  @ApiParam({ name: 'id', description: '提交记录ID', type: Number })
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
      response.data = await this.examinationSubmitService.remove(id);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post('query')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '通用查询考试提交（支持分页）' })
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
      const res = await this.examinationSubmitService.findCommon(query);
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
