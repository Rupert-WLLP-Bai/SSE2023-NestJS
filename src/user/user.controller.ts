import { QueryUserDto } from './dto/query-user.dto';
import {
  QueryResponse,
  UpdateResponse,
} from 'src/common/response/response.interface';
import {
  NormalResponse,
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
  UseGuards,
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);
  @Post()
  @ApiBody({ type: CreateUserDto })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(AnyFilesInterceptor()) // 使用form-data格式上传
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() createUserDto: CreateUserDto): Promise<NormalResponse> {
    this.logger.log(JSON.stringify(createUserDto));
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
      const res = await this.userService.create(createUserDto);
      result.data = res;
    } catch (error) {
      result.success = false;
      result.errorMessage = error.message;
    }
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id查询用户' })
  @ApiParam({ name: 'id', description: '用户id' })
  async findOne(@Param('id') id: string): Promise<QueryResponse> {
    // 日志输出参数
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
    const query_result = await this.userService.findOne(+id);
    result.data = {
      list: [query_result],
      total: query_result ? 1 : 0,
    };
    return result;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id更新用户' })
  @ApiParam({ name: 'id', description: '用户id' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(id);
    this.logger.log(JSON.stringify(updateUserDto));
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id删除用户' })
  @ApiParam({ name: 'id', description: '用户id' })
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
    result.data = await this.userService.remove(+id);
    return result;
  }

  // 分页查询
  // GET /user?page=1&pageSize=10
  // 如果不传page和pageSize, 则返回所有数据
  // page设置为required: false, pageSize设置为required: false
  @Get()
  @UseGuards(JwtAuthGuard)
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
      const data = await this.userService.findPage(page, pageSize);
      result.data.list = data[0];
      result.data.total = data[1];
      result.data.current = Number(page);
      result.data.pageSize = Number(pageSize);
    } else {
      const data = await this.userService.findAllAndCount();
      result.data.list = data[0];
      result.data.total = data[1];
    }
    return result;
  }

  // 通用查询
  // TODO 测试完成后将之前的分页查询删除
  // POST /user/query
  @Post('query')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '通用查询用户' })
  @ApiBody({
    type: QueryUserDto,
    description: '查询条件',
    required: false,
  })
  async findCommon(@Body() queryUserDto: QueryUserDto) {
    this.logger.log(JSON.stringify(queryUserDto));
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
      const data = await this.userService.findCommon(queryUserDto);
      result.data.list = data[0];
      result.data.total = data[1];
      result.data.current = Number(queryUserDto.page);
      result.data.pageSize = Number(queryUserDto.limit);
    } catch (e) {
      result.success = false;
      result.errorMessage = e.message;
    } finally {
      return result;
    }
  }
}
