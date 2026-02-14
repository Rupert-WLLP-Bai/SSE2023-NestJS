import {
  QueryResponse,
  NormalResponse,
  UpdateResponse,
  DeleteResponse,
} from '../common/response/response.interface';
import { QueryClassDto } from './dto/query-class.dto';
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
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('class')
@ApiTags('class')
@UseGuards(JwtAuthGuard)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @ApiOperation({ summary: '创建班级' })
  @ApiBody({ type: CreateClassDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    type: NormalResponse,
  })
  async create(
    @Body() createClassDto: CreateClassDto,
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
      response.data = await this.classService.create(createClassDto);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: '查询所有班级' })
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
      response.data.list = await this.classService.findAll();
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id查询班级' })
  @ApiParam({ name: 'id', description: '班级id' })
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
      const res = await this.classService.findOne(+id);
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
  @ApiOperation({ summary: '根据id更新班级' })
  @ApiBody({ type: UpdateClassDto })
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
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
      response.data = await this.classService.update(+id, updateClassDto);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据id删除班级' })
  @ApiParam({ name: 'id', description: '班级id' })
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
      response.data = await this.classService.remove(+id);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post('query')
  @ApiOperation({ summary: '通用查询班级' })
  @ApiBody({ type: QueryClassDto })
  async findCommon(
    @Body() queryClassDto: QueryClassDto,
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
      const res = await this.classService.findCommon(queryClassDto);
      response.success = true;
      response.data.list = res[0];
      response.data.total = res[1];
      response.data.current = queryClassDto.page;
      response.data.pageSize = queryClassDto.limit;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: '根据课程ID查询班级' })
  @ApiParam({ name: 'courseId', description: '课程ID' })
  async findByCourseId(@Param('courseId') courseId: string): Promise<QueryResponse> {
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
      response.data.list = await this.classService.findByCourseId(+courseId);
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: '根据教师ID查询班级' })
  @ApiParam({ name: 'teacherId', description: '教师ID' })
  async findByTeacherId(@Param('teacherId') teacherId: string): Promise<QueryResponse> {
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
      response.data.list = await this.classService.findByTeacherId(+teacherId);
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }
}
