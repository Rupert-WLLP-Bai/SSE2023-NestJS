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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ExaminationStudentListService,
  ImportResult,
} from './examination_student_list.service';
import { CreateExaminationStudentListDto } from './dto/create-examination_student_list.dto';
import { UpdateExaminationStudentListDto } from './dto/update-examination_student_list.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../common/guards';
import { UserRole } from '../user/entities/user.entity';
import {
  NormalResponse,
  QueryResponse,
  UpdateResponse,
  DeleteResponse,
} from '../common/response/response.interface';

@ApiTags('examination-student-list')
@Controller('examination-student-list')
export class ExaminationStudentListController {
  constructor(
    private readonly studentListService: ExaminationStudentListService,
  ) {}
  private readonly logger = new Logger(ExaminationStudentListController.name);

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建考试学生记录' })
  @ApiBody({ type: CreateExaminationStudentListDto })
  async create(
    @Body() createExaminationStudentListDto: CreateExaminationStudentListDto,
  ): Promise<NormalResponse> {
    this.logger.log(JSON.stringify(createExaminationStudentListDto));
    const result: NormalResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      const res = await this.studentListService.create(
        createExaminationStudentListDto,
      );
      result.data = res;
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '分页查询考试学生' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '页码',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: '每页数量',
  })
  async findPage(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<QueryResponse> {
    this.logger.log(`page: ${page}, pageSize: ${pageSize}`);
    const result: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    if (page && pageSize) {
      const data = await this.studentListService.findPage(page, pageSize);
      result.data.list = data[0];
      result.data.total = data[1];
      result.data.current = Number(page);
      result.data.pageSize = Number(pageSize);
    } else {
      const data = await this.studentListService.findAndCount();
      result.data.list = data[0];
      result.data.total = data[1];
    }
    return result;
  }

  @Get('examination/:examinationId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据考试ID查询学生列表' })
  @ApiParam({ name: 'examinationId', description: '考试ID' })
  async findByExaminationId(
    @Param('examinationId') examinationId: string,
  ): Promise<QueryResponse> {
    this.logger.log(examinationId);
    const result: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    const data = await this.studentListService.findByExaminationId(
      +examinationId,
    );
    result.data.list = data;
    result.data.total = data.length;
    return result;
  }

  @Get('student/:studentId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据学生ID查询考试记录' })
  @ApiParam({ name: 'studentId', description: '学生ID' })
  async findByStudentId(
    @Param('studentId') studentId: string,
  ): Promise<QueryResponse> {
    this.logger.log(studentId);
    const result: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    const data = await this.studentListService.findByStudentId(+studentId);
    result.data.list = data;
    result.data.total = data.length;
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id查询考试学生' })
  @ApiParam({ name: 'id', description: '记录ID' })
  async findOne(@Param('id') id: string): Promise<QueryResponse> {
    this.logger.log(id);
    const result: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    const queryResult = await this.studentListService.findOne(+id);
    result.data = {
      list: [queryResult],
      total: queryResult ? 1 : 0,
    };
    return result;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id更新考试学生' })
  @ApiParam({ name: 'id', description: '记录ID' })
  @ApiBody({ type: UpdateExaminationStudentListDto })
  async update(
    @Param('id') id: string,
    @Body() updateExaminationStudentListDto: UpdateExaminationStudentListDto,
  ): Promise<UpdateResponse> {
    this.logger.log(id);
    this.logger.log(JSON.stringify(updateExaminationStudentListDto));
    const result: UpdateResponse = {
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
      result.data = await this.studentListService.update(
        +id,
        updateExaminationStudentListDto,
      );
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id删除考试学生' })
  @ApiParam({ name: 'id', description: '记录ID' })
  async remove(@Param('id') id: string): Promise<DeleteResponse> {
    this.logger.log(id);
    const result: DeleteResponse = {
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
      const deleteResult = await this.studentListService.remove(+id);
      result.data.affected = deleteResult.affected || 0;
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }

  @Post('examination/:examinationId/import-class/:classId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '按班级导入考生' })
  @ApiParam({ name: 'examinationId', description: '考试ID' })
  @ApiParam({ name: 'classId', description: '班级ID' })
  async importClass(
    @Param('examinationId', ParseIntPipe) examinationId: number,
    @Param('classId', ParseIntPipe) classId: number,
  ): Promise<NormalResponse> {
    this.logger.log(
      `Importing students for examination ${examinationId} from class ${classId}`,
    );
    const result: NormalResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      const importResult: ImportResult =
        await this.studentListService.importStudentsFromClass(
          examinationId,
          classId,
        );
      result.data = importResult;
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }
}
