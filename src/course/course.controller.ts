import {
  QueryResponse,
  NormalResponse,
  UpdateResponse,
  DeleteResponse,
} from '../common/response/response.interface';
import { QueryCourseDto } from './dto/query-course.dto';
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
  Logger,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('course')
@ApiTags('course')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  private readonly logger = new Logger(CourseController.name);

  @Post()
  @ApiOperation({ summary: '创建课程' })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    type: NormalResponse,
  })
  async create(
    @Body() createCourseDto: CreateCourseDto,
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
      response.data = await this.courseService.create(createCourseDto);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: '查询所有课程' })
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
      response.data.list = await this.courseService.findAll();
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id查询课程' })
  @ApiParam({ name: 'id', description: '课程id' })
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
      const res = await this.courseService.findOne(+id);
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
  @ApiOperation({ summary: '根据id更新课程' })
  @ApiBody({ type: UpdateCourseDto })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
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
      response.data = await this.courseService.update(+id, updateCourseDto);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据id删除课程' })
  @ApiParam({ name: 'id', description: '课程id' })
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
      response.data = await this.courseService.remove(+id);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post('query')
  @ApiOperation({ summary: '通用查询课程' })
  @ApiBody({ type: QueryCourseDto })
  async findCommon(
    @Body() queryCourseDto: QueryCourseDto,
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
      const res = await this.courseService.findCommon(queryCourseDto);
      response.success = true;
      response.data.list = res[0];
      response.data.total = res[1];
      response.data.current = queryCourseDto.page;
      response.data.pageSize = queryCourseDto.limit;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }
}
