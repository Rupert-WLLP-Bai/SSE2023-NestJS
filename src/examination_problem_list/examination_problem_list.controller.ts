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
import { ExaminationProblemListService } from './examination_problem_list.service';
import { CreateExaminationProblemListDto } from './dto/create-examination_problem_list.dto';
import { UpdateExaminationProblemListDto } from './dto/update-examination_problem_list.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  NormalResponse,
  QueryResponse,
  UpdateResponse,
  DeleteResponse,
} from '../common/response/response.interface';

@ApiTags('examination-problem-list')
@Controller('examination-problem-list')
export class ExaminationProblemListController {
  constructor(
    private readonly problemListService: ExaminationProblemListService,
  ) {}
  private readonly logger = new Logger(ExaminationProblemListController.name);

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建考试题目' })
  @ApiBody({ type: CreateExaminationProblemListDto })
  async create(
    @Body() createExaminationProblemListDto: CreateExaminationProblemListDto,
  ): Promise<NormalResponse> {
    this.logger.log(JSON.stringify(createExaminationProblemListDto));
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
      const res = await this.problemListService.create(
        createExaminationProblemListDto,
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
  @ApiOperation({ summary: '分页查询考试题目' })
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
      const data = await this.problemListService.findPage(page, pageSize);
      result.data.list = data[0];
      result.data.total = data[1];
      result.data.current = Number(page);
      result.data.pageSize = Number(pageSize);
    } else {
      const data = await this.problemListService.findAndCount();
      result.data.list = data[0];
      result.data.total = data[1];
    }
    return result;
  }

  @Get('examination/:examinationId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据考试ID查询题目列表' })
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
    const data = await this.problemListService.findByExaminationId(
      +examinationId,
    );
    result.data.list = data;
    result.data.total = data.length;
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id查询考试题目' })
  @ApiParam({ name: 'id', description: '题目ID' })
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
    const queryResult = await this.problemListService.findOne(+id);
    result.data = {
      list: [queryResult],
      total: queryResult ? 1 : 0,
    };
    return result;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id更新考试题目' })
  @ApiParam({ name: 'id', description: '题目ID' })
  @ApiBody({ type: UpdateExaminationProblemListDto })
  async update(
    @Param('id') id: string,
    @Body() updateExaminationProblemListDto: UpdateExaminationProblemListDto,
  ): Promise<UpdateResponse> {
    this.logger.log(id);
    this.logger.log(JSON.stringify(updateExaminationProblemListDto));
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
      result.data = await this.problemListService.update(
        +id,
        updateExaminationProblemListDto,
      );
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id删除考试题目' })
  @ApiParam({ name: 'id', description: '题目ID' })
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
      const deleteResult = await this.problemListService.remove(+id);
      result.data.affected = deleteResult.affected || 0;
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }
}
