import {
  QueryResponse,
  UpdateResponse,
} from 'src/common/response/response.interface';
import {
  Response,
  DeleteResponse,
} from './../common/response/response.interface';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: '创建用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id查询用户' })
  @ApiParam({ name: 'id', description: '用户id' })
  async findOne(@Param('id') id: string): Promise<QueryResponse> {
    // 日志输出参数
    Logger.log('[GET] /user/:id', id);
    const result: QueryResponse = {
      success: true,
      data: {},
      errorCode: '',
      errorMessage: '',
      showType: 0,
      traceId: '',
      host: '',
    };
    const query_result = await this.userService.findOne(+id);
    result.data = {
      list: [query_result],
      total: query_result ? 1 : 0,
    };
    return result;
  }

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

  @Delete(':id')
  @ApiOperation({ summary: '根据id删除用户' })
  @ApiParam({ name: 'id', description: '用户id' })
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
    result.data = await this.userService.remove(+id);
    return result;
  }

  // 分页查询
  // GET /user?page=1&pageSize=10
  // 如果不传page和pageSize, 则返回所有数据
  // page设置为required: false, pageSize设置为required: false
  @Get()
  @ApiOperation({ summary: '分页查询用户' })
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
    // 将page和pageSize设置为可选参数
    // 设置swagger文档中的参数为可选
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
      const data = await this.userService.findPage(page, pageSize);
      result.data.list = data[0];
      result.data.total = data[1];
    } else {
      const data = await this.userService.findAllAndCount();
      result.data.list = data[0];
      result.data.total = data[1];
    }
    return result;
  }
}
