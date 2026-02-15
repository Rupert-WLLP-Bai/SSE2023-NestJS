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
import { TotalScoreService } from './total_score.service';
import { CreateTotalScoreDto } from './dto/create-total_score.dto';
import { UpdateTotalScoreDto } from './dto/update-total_score.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../common/guards';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('total-score')
@ApiBearerAuth('JWT-auth')
@Controller('total-score')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TotalScoreController {
  constructor(private readonly totalScoreService: TotalScoreService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '创建总成绩' })
  @ApiBody({ type: CreateTotalScoreDto })
  @ApiResponse({ status: 201, description: '创建成功', type: NormalResponse })
  async create(
    @Body() createTotalScoreDto: CreateTotalScoreDto,
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
      response.data = await this.totalScoreService.create(createTotalScoreDto);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '获取所有总成绩' })
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
      response.data.list = await this.totalScoreService.findAll();
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
  @ApiOperation({ summary: '根据ID获取总成绩' })
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
      const res = await this.totalScoreService.findOne(id);
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
  @ApiOperation({ summary: '更新总成绩' })
  @ApiParam({ name: 'id', description: '成绩ID', type: Number })
  @ApiBody({ type: UpdateTotalScoreDto })
  @ApiResponse({ status: 200, description: '更新成功', type: UpdateResponse })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTotalScoreDto: UpdateTotalScoreDto,
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
      const result = await this.totalScoreService.update(
        id,
        updateTotalScoreDto,
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
  @ApiOperation({ summary: '删除总成绩' })
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
      response.data = await this.totalScoreService.remove(id);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post('query')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: '通用查询总成绩（支持分页）' })
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
      const res = await this.totalScoreService.findCommon(query);
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

  @Post('course/:courseId/recalculate')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: '重新计算课程全体学生总分' })
  @ApiParam({ name: 'courseId', description: '课程ID', type: Number })
  @ApiResponse({ status: 200, description: '重算成功', type: QueryResponse })
  async recalculate(
    @Param('courseId', ParseIntPipe) courseId: number,
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
      const results = await this.totalScoreService.recalculate(courseId);
      response.success = true;
      response.data.list = results;
      response.data.total = results.length;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get('course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: '查询课程全体学生总分' })
  @ApiParam({ name: 'courseId', description: '课程ID', type: Number })
  @ApiResponse({ status: 200, description: '查询成功', type: QueryResponse })
  async findByCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
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
      const results = await this.totalScoreService.findByCourseWithStudents(
        courseId,
      );
      response.success = true;
      response.data.list = results;
      response.data.total = results.length;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }
}
