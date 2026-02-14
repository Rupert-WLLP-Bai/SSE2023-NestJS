import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TotalWeightService } from './total_weight.service';
import { CreateTotalWeightDto } from './dto/create-total_weight.dto';
import { UpdateTotalWeightDto } from './dto/update-total_weight.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '../common/guards';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('total-weight')
@ApiBearerAuth('JWT-auth')
@Controller('total-weight')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TotalWeightController {
  constructor(private readonly totalWeightService: TotalWeightService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: '创建或更新课程总权重 (upsert)' })
  @ApiBody({ type: CreateTotalWeightDto })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '权重校验失败' })
  create(@Body() createTotalWeightDto: CreateTotalWeightDto) {
    return this.totalWeightService.create(createTotalWeightDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '获取所有课程总权重' })
  findAll() {
    return this.totalWeightService.findAll();
  }

  @Get('course/:courseId')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '获取指定课程的总权重' })
  @ApiParam({ name: 'courseId', description: '课程ID', type: Number })
  @ApiResponse({ status: 200, description: '成功获取' })
  @ApiResponse({ status: 404, description: '课程权重未找到' })
  findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.totalWeightService.findByCourse(courseId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.ASSISTANT)
  @ApiOperation({ summary: '根据ID获取总权重' })
  @ApiParam({ name: 'id', description: '权重ID', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.totalWeightService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: '更新总权重' })
  @ApiParam({ name: 'id', description: '权重ID', type: Number })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 400, description: '权重校验失败' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTotalWeightDto: UpdateTotalWeightDto,
  ) {
    return this.totalWeightService.update(id, updateTotalWeightDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ summary: '删除总权重' })
  @ApiParam({ name: 'id', description: '权重ID', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.totalWeightService.remove(id);
  }
}
