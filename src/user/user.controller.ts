import { QueryUserDto } from './dto/query-user.dto';
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
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(JSON.stringify(createUserDto));
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id查询用户' })
  @ApiParam({ name: 'id', description: '用户id' })
  async findOne(@Param('id') id: string) {
    this.logger.log(id);
    const queryResult = await this.userService.findOne(+id);
    return {
      list: [queryResult],
      total: queryResult ? 1 : 0,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id更新用户' })
  @ApiParam({ name: 'id', description: '用户id' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(id);
    this.logger.log(JSON.stringify(updateUserDto));
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据id删除用户' })
  @ApiParam({ name: 'id', description: '用户id' })
  async remove(@Param('id') id: string) {
    this.logger.log(id);
    return this.userService.remove(+id);
  }

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
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    this.logger.log(page);
    this.logger.log(pageSize);
    if (page && pageSize) {
      const data = await this.userService.findPage(page, pageSize);
      return {
        list: data[0],
        total: data[1],
        current: Number(page),
        pageSize: Number(pageSize),
      };
    } else {
      const data = await this.userService.findAllAndCount();
      return {
        list: data[0],
        total: data[1],
      };
    }
  }

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
    const data = await this.userService.findCommon(queryUserDto);
    return {
      list: data[0],
      total: data[1],
      current: Number(queryUserDto.page),
      pageSize: Number(queryUserDto.limit),
    };
  }
}
