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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  NormalResponse,
  QueryResponse,
  UpdateResponse,
  DeleteResponse,
} from '../common/response/response.interface';

@ApiTags('examination')
@Controller('examination')
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}
  private readonly logger = new Logger(ExaminationController.name);

  @Post()
  @ApiOperation({ summary: '创建考试' })
  @ApiBody({ type: CreateExaminationDto })
  async create(
    @Body() createExaminationDto: CreateExaminationDto,
  ): Promise<NormalResponse> {
    this.logger.log(JSON.stringify(createExaminationDto));
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
      const res = await this.examinationService.create(createExaminationDto);
      result.data = res;
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
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
      const data = await this.examinationService.findPage(page, pageSize);
      result.data.list = data[0];
      result.data.total = data[1];
      result.data.current = Number(page);
      result.data.pageSize = Number(pageSize);
    } else {
      const data = await this.examinationService.findAndCount();
      result.data.list = data[0];
      result.data.total = data[1];
    }
    return result;
  }

  @Post('query')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '通用查询考试' })
  @ApiBody({
    type: QueryExaminationDto,
    description: '查询条件',
    required: false,
  })
  async findCommon(
    @Body() queryExaminationDto: QueryExaminationDto,
  ): Promise<QueryResponse> {
    this.logger.log(JSON.stringify(queryExaminationDto));
    const result: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    try {
      const data = await this.examinationService.findCommon(queryExaminationDto);
      result.data.list = data[0];
      result.data.total = data[1];
      result.data.current = Number(queryExaminationDto.page);
      result.data.pageSize = Number(queryExaminationDto.limit);
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id查询考试' })
  @ApiParam({ name: 'id', description: '考试id' })
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
    const queryResult = await this.examinationService.findOne(+id);
    result.data = {
      list: [queryResult],
      total: queryResult ? 1 : 0,
    };
    return result;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id更新考试' })
  @ApiParam({ name: 'id', description: '考试id' })
  @ApiBody({ type: UpdateExaminationDto })
  async update(
    @Param('id') id: string,
    @Body() updateExaminationDto: UpdateExaminationDto,
  ): Promise<UpdateResponse> {
    this.logger.log(id);
    this.logger.log(JSON.stringify(updateExaminationDto));
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
      result.data = await this.examinationService.update(
        +id,
        updateExaminationDto,
      );
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id删除考试' })
  @ApiParam({ name: 'id', description: '考试id' })
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
      await this.examinationService.remove(+id);
      result.data.affected = 1;
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }
}
