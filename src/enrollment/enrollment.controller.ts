import {
  QueryResponse,
  NormalResponse,
  UpdateResponse,
  DeleteResponse,
} from '../common/response/response.interface';
import { QueryEnrollmentDto } from './dto/query-enrollment.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('enrollment')
@ApiTags('enrollment')
@UseGuards(JwtAuthGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @ApiOperation({ summary: '创建选课记录' })
  @ApiBody({ type: CreateEnrollmentDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    type: NormalResponse,
  })
  async create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
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
      response.data = await this.enrollmentService.create(createEnrollmentDto);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: '查询所有选课记录' })
  async findAll(): Promise<QueryResponse> {
    const response: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      response.data.list = await this.enrollmentService.findAll();
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id查询选课记录' })
  @ApiParam({ name: 'id', description: '选课记录id' })
  async findOne(@Param('id') id: string): Promise<QueryResponse> {
    const response: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      const res = await this.enrollmentService.findOne(+id);
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
  @ApiOperation({ summary: '根据id更新选课记录' })
  @ApiBody({ type: UpdateEnrollmentDto })
  async update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<UpdateResponse> {
    const response: UpdateResponse = {
      success: true,
      data: {
        raw: {},
        affected: 0,
        generatedMaps: [],
      },
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      response.data = await this.enrollmentService.update(
        +id,
        updateEnrollmentDto,
      );
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据id删除选课记录' })
  @ApiParam({ name: 'id', description: '选课记录id' })
  async remove(@Param('id') id: string): Promise<DeleteResponse> {
    const response: DeleteResponse = {
      success: true,
      data: {
        raw: {},
        affected: 0,
      },
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      response.data = await this.enrollmentService.remove(+id);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post('query')
  @ApiOperation({ summary: '通用查询选课记录' })
  @ApiBody({ type: QueryEnrollmentDto })
  async findCommon(
    @Body() queryEnrollmentDto: QueryEnrollmentDto,
  ): Promise<QueryResponse> {
    const response: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      const res = await this.enrollmentService.findCommon(queryEnrollmentDto);
      response.success = true;
      response.data.list = res[0];
      response.data.total = res[1];
      response.data.current = queryEnrollmentDto.page;
      response.data.pageSize = queryEnrollmentDto.limit;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: '根据学生ID查询选课记录' })
  @ApiParam({ name: 'studentId', description: '学生ID' })
  async findByStudentId(
    @Param('studentId') studentId: string,
  ): Promise<QueryResponse> {
    const response: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      response.data.list = await this.enrollmentService.findByStudentId(
        +studentId,
      );
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get('class/:classId')
  @ApiOperation({ summary: '根据班级ID查询选课记录' })
  @ApiParam({ name: 'classId', description: '班级ID' })
  async findByClassId(
    @Param('classId') classId: string,
  ): Promise<QueryResponse> {
    const response: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      response.data.list = await this.enrollmentService.findByClassId(+classId);
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: '根据课程ID查询选课记录' })
  @ApiParam({ name: 'courseId', description: '课程ID' })
  async findByCourseId(
    @Param('courseId') courseId: string,
  ): Promise<QueryResponse> {
    const response: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      response.data.list = await this.enrollmentService.findByCourseId(
        +courseId,
      );
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post('student/:studentId/class/:classId/drop')
  @ApiOperation({ summary: '学生退课' })
  @ApiParam({ name: 'studentId', description: '学生ID' })
  @ApiParam({ name: 'classId', description: '班级ID' })
  async dropCourse(
    @Param('studentId') studentId: string,
    @Param('classId') classId: string,
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
      response.data = await this.enrollmentService.dropCourse(
        +studentId,
        +classId,
      );
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }
}
