import {
  ApiBody,
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
} from '@nestjs/common';
import {
  Response,
  QueryResponse,
  DeleteResponse,
} from './../common/response/response.interface';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@ApiTags('notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  @ApiBody({ type: CreateNoticeDto })
  @ApiOperation({ summary: '创建公告' })
  async create(@Body() createNoticeDto: CreateNoticeDto): Promise<Response> {
    const res = await this.noticeService.create(createNoticeDto);
    const result: Response = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    result.data = res;
    return result;
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: '公告id' })
  @ApiOperation({ summary: '根据id查询公告' })
  async findOne(@Param('id') id: string): Promise<QueryResponse> {
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

  /**
   * 
  @Patch(':id')
  @ApiOperation({ summary: '根据id更新用户' })
  @ApiParam({ name: 'id', description: '用户id' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
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
    result.data = await this.userService.update(+id, updateUserDto);
    return result;
  }
   */
  @Patch(':id')
  @ApiOperation({ summary: '根据id更新公告' })
  @ApiParam({ name: 'id', description: '公告id' })
  @ApiBody({ type: UpdateNoticeDto })
  async update(
    @Param('id') id: string,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    const result: Response = {
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
  @ApiOperation({ summary: '根据id删除公告' })
  @ApiParam({ name: 'id', description: '公告id' })
  async remove(@Param('id') id: string) {
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
}
