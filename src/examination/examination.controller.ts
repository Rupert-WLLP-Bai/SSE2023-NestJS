import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ExaminationService } from './examination.service';
import { CreateExaminationDto } from './dto/create-examination.dto';
import { UpdateExaminationDto } from './dto/update-examination.dto';
import { QueryExaminationDto } from './dto/query-examination.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../common/guards';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('examination')
@ApiBearerAuth('JWT-auth')
@Controller('examination')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}
  private readonly logger = new Logger(ExaminationController.name);

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '创建考试' })
  @ApiBody({ type: CreateExaminationDto })
  async create(@Body() createExaminationDto: CreateExaminationDto) {
    this.logger.log(JSON.stringify(createExaminationDto));
    return this.examinationService.create(createExaminationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: '分页查询考试' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '页码, 不传则返回所有数据',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: '每页数量, 不传则返回所有数据',
  })
  async findPage(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    this.logger.log(`page: ${page}, pageSize: ${pageSize}`);
    if (page && pageSize) {
      const data = await this.examinationService.findPage(page, pageSize);
      return {
        list: data[0],
        total: data[1],
        current: Number(page),
        pageSize: Number(pageSize),
      };
    } else {
      const data = await this.examinationService.findAndCount();
      return {
        list: data[0],
        total: data[1],
      };
    }
  }

  @Post('query')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: '通用查询考试' })
  @ApiBody({
    type: QueryExaminationDto,
    description: '查询条件',
    required: false,
  })
  async findCommon(@Body() queryExaminationDto: QueryExaminationDto) {
    this.logger.log(JSON.stringify(queryExaminationDto));
    const data = await this.examinationService.findCommon(queryExaminationDto);
    return {
      list: data[0],
      total: data[1],
      current: Number(queryExaminationDto.page),
      pageSize: Number(queryExaminationDto.limit),
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT, UserRole.STUDENT)
  @ApiOperation({ summary: '根据id查询考试' })
  @ApiParam({ name: 'id', description: '考试id' })
  async findOne(@Param('id') id: string) {
    this.logger.log(id);
    const queryResult = await this.examinationService.findOne(+id);
    return {
      list: [queryResult],
      total: queryResult ? 1 : 0,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '根据id更新考试' })
  @ApiParam({ name: 'id', description: '考试id' })
  @ApiBody({ type: UpdateExaminationDto })
  async update(
    @Param('id') id: string,
    @Body() updateExaminationDto: UpdateExaminationDto,
  ) {
    this.logger.log(id);
    this.logger.log(JSON.stringify(updateExaminationDto));
    return this.examinationService.update(+id, updateExaminationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: '根据id删除考试' })
  @ApiParam({ name: 'id', description: '考试id' })
  async remove(@Param('id') id: string) {
    this.logger.log(id);
    return this.examinationService.remove(+id);
  }

  @Post(':id/start')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '开始考试：将状态从 NOT_STARTED 转换为 IN_PROGRESS' })
  @ApiParam({ name: 'id', description: '考试id' })
  async start(@Param('id') id: string) {
    this.logger.log(`Starting examination: ${id}`);
    return this.examinationService.start(+id);
  }

  @Post(':id/end')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '结束考试：将状态从 IN_PROGRESS 转换为 FINISHED' })
  @ApiParam({ name: 'id', description: '考试id' })
  async end(@Param('id') id: string) {
    this.logger.log(`Ending examination: ${id}`);
    return this.examinationService.end(+id);
  }

  @Post(':id/archive')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: '归档考试：将状态从 FINISHED 转换为 ARCHIVED' })
  @ApiParam({ name: 'id', description: '考试id' })
  async archive(@Param('id') id: string) {
    this.logger.log(`Archiving examination: ${id}`);
    return this.examinationService.archive(+id);
  }
}
