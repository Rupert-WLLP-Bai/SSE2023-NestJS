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
import { NormalResponse } from '../common/response/response.interface';

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
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: '查询所有课程' })
  async findAll() {
    const list = await this.courseService.findAll();
    return {
      list,
      total: list.length,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id查询课程' })
  @ApiParam({ name: 'id', description: '课程id' })
  async findOne(@Param('id') id: string) {
    const res = await this.courseService.findOne(+id);
    return {
      list: res ? [res] : [],
      total: res ? 1 : 0,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '根据id更新课程' })
  @ApiBody({ type: UpdateCourseDto })
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据id删除课程' })
  @ApiParam({ name: 'id', description: '课程id' })
  async remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }

  @Post('query')
  @ApiOperation({ summary: '通用查询课程' })
  @ApiBody({ type: QueryCourseDto })
  async findCommon(@Body() queryCourseDto: QueryCourseDto) {
    const res = await this.courseService.findCommon(queryCourseDto);
    return {
      list: res[0],
      total: res[1],
      current: queryCourseDto.page,
      pageSize: queryCourseDto.limit,
    };
  }
}
