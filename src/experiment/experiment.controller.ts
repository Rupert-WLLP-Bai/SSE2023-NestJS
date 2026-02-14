import { ExperimentSubmitService } from './../experiment_submit/experiment_submit.service';
import { DeleteResponse } from './../common/response/response.interface';
import { UpdateResponse } from '../common/response/response.interface';
import {
  QueryResponse,
  NormalResponse,
} from '../common/response/response.interface';
import { QueryExperimentDto } from './dto/query-experiment.dto';
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
  Res,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ExperimentService } from './experiment.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('experiment')
@ApiTags('experiment')
@UseGuards(JwtAuthGuard)
export class ExperimentController {
  constructor(
    private readonly experimentService: ExperimentService,
    private readonly exprerimentSubmitService: ExperimentSubmitService,
  ) {}
  private readonly logger = new Logger(ExperimentController.name);

  @Post()
  @ApiOperation({ summary: '创建实验' })
  @ApiBody({ type: CreateExperimentDto })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
    type: NormalResponse,
  })
  async create(
    @Body() createExperimentDto: CreateExperimentDto,
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
      response.data = await this.experimentService.create(createExperimentDto);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get()
  @ApiOperation({ summary: '查询所有实验' })
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
      response.data.list = await this.experimentService.findAll();
      response.data.total = response.data.list.length;
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id查询实验' })
  @ApiParam({ name: 'id', description: '实验id' })
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
      const res = await this.experimentService.findOne(+id);
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
  @ApiOperation({ summary: '根据id更新实验' })
  @ApiBody({ type: UpdateExperimentDto })
  async update(
    @Param('id') id: string,
    @Body() updateExperimentDto: UpdateExperimentDto,
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
      response.data = await this.experimentService.update(
        +id,
        updateExperimentDto,
      );
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据id删除实验' })
  @ApiParam({ name: 'id', description: '实验id' })
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
      response.data = await this.experimentService.remove(+id);
      response.success = true;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  @Post('query')
  @ApiOperation({ summary: '通用查询实验' })
  @ApiBody({ type: QueryExperimentDto })
  async findCommon(
    @Body() queryExperimentDto: QueryExperimentDto,
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
      const res = await this.experimentService.findCommon(queryExperimentDto);
      response.success = true;
      response.data.list = res[0];
      response.data.total = res[1];
      response.data.current = queryExperimentDto.page;
      response.data.pageSize = queryExperimentDto.limit;
    } catch (e) {
      response.success = false;
      response.errorMessage = e.message;
    }
    return response;
  }

  // 查询实验提交
  // GET /experiment/:id/submit/:studentId
  @Get(':id/submit/:studentId')
  @ApiOperation({
    summary: '根据实验id和学生id下载实验提交的文件(未完成)',
    deprecated: true,
  })
  @ApiParam({ name: 'id', description: '实验id', example: 1 })
  @ApiParam({ name: 'studentId', description: '学生id', example: 2052526 })
  async findSubmit(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
    @Res() res,
  ) {
    const result = await this.exprerimentSubmitService.findCommon({
      page: 1,
      limit: 10,
      sort: 'id',
      order: 'DESC',
      filter: {
        experimentId: +id,
        studentId: +studentId,
      },
    });
    if (!result[0][0]) {
      throw new NotFoundException('文件不存在');
    }
    const file = result[0][0].file;
    this.logger.log('file: ' + file);
    // convert file to json
    // TODO 从数据库中读取bytea类型的数据，转换为文件
    // log all the properties of the file
    res.set('Content-Type', 'application/octet-stream');
    res.set(
      'Content-Disposition',
      'attachment; filename=' + result[0][0].fileName,
    );
    res.send(file);
  }
}
