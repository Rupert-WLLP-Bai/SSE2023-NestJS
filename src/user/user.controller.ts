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
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

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
  findOne(@Param('id') id: string) {
    // 日志输出参数
    Logger.log('[GET] /user/:id', id);
    // 单条记录返回格式
    // {
    //   "success": true,
    //   "data": {},
    //   "message": "查询成功"
    // }
    const result = {
      success: true,
      data: {},
      message: '查询成功',
    };
    result.data = this.userService.findOne(+id);
    return result;
  }

  @Patch(':id')
  @ApiOperation({ summary: '根据id更新用户' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = {
      success: true,
      data: {},
      message: '更新成功',
    };
    result.data = this.userService.update(+id, updateUserDto);
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据id删除用户' })
  remove(@Param('id') id: string) {
    const result = {
      success: true,
      data: {},
      message: '删除成功',
    };
    result.data = this.userService.remove(+id);
    return result;
  }

  // 分页查询
  // GET /user?page=1&pageSize=10
  // 如果不传page和pageSize, 则返回所有数据
  // page设置为required: false, pageSize设置为required: false
  @Get()
  @ApiOperation({ summary: '分页查询用户' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  async findPage(
    // 将page和pageSize设置为可选参数
    // 设置swagger文档中的参数为可选
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const result = {
      success: true,
      data: {},
      message: '查询成功',
      total: 0,
    };
    if (page && pageSize) {
      const data = await this.userService.findPage(page, pageSize);
      result.data = data[0];
      result.total = data[1];
    } else {
      const data = await this.userService.findAllAndCount();
      result.data = data[0];
      result.total = data[1];
    }
    return result;
  }
}
