import { QueryNoticeDto } from './dto/query-notice.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
  Query,
  UseInterceptors,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  NormalResponse,
  QueryResponse,
  DeleteResponse,
} from './../common/response/response.interface';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}
  private readonly logger = new Logger(NoticeController.name);
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateNoticeDto })
  @ApiOperation({ summary: '创建公告' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(AnyFilesInterceptor())
  async create(@Body() createNoticeDto: CreateNoticeDto): Promise<NormalResponse> {
    this.logger.log(JSON.stringify(createNoticeDto));
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
      const res = await this.noticeService.create(createNoticeDto);
      result.data = res;
    } catch (e) {
      this.logger.warn(e);
      result.success = false;
      result.errorMessage = e.message;
    }
    return result;
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: '公告id' })
  @ApiOperation({ summary: '根据id查询公告' })
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
    const query_result = await this.noticeService.findOne(+id);
    result.data = {
      list: [query_result],
      total: query_result ? 1 : 0,
    };
    return result;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id更新公告' })
  @ApiParam({ name: 'id', description: '公告id' })
  @ApiBody({ type: UpdateNoticeDto })
  async update(
    @Param('id') id: string,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    this.logger.log(id);
    this.logger.log(JSON.stringify(updateNoticeDto));
    const result: NormalResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    result.data = await this.noticeService.update(+id, updateNoticeDto);
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id删除公告' })
  @ApiParam({ name: 'id', description: '公告id' })
  async remove(@Param('id') id: string) {
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
    result.data = await this.noticeService.remove(+id);
    return result;
  }

  // 分页查询
  @Get()
  @ApiOperation({ summary: '分页查询公告' })
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
    this.logger.log(page);
    this.logger.log(pageSize);
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
      const data = await this.noticeService.findPage(page, pageSize);
      result.data.list = data[0];
      result.data.total = data[1];
      result.data.current = Number(page);
      result.data.pageSize = Number(pageSize);
    } else {
      const data = await this.noticeService.findAllAndCount();
      result.data.list = data[0];
      result.data.total = data[1];
    }
    return result;
  }

  // 通用查询
  @Post('query')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '通用查询公告' })
  @ApiBody({ type: QueryNoticeDto })
  async findCommon(@Body() queryNoticeDto: QueryNoticeDto) {
    this.logger.log(JSON.stringify(queryNoticeDto));
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
      const data = await this.noticeService.findCommon(queryNoticeDto);
      result.data.list = data[0];
      result.data.total = data[1];
    } catch (e) {
      this.logger.warn(e);
      result.success = false;
      result.errorMessage = e.message;
    }
    return result;
  }
}
