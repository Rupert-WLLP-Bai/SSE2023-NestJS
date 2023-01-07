import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExperimentService } from './experiment.service';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { UpdateExperimentDto } from './dto/update-experiment.dto';

@Controller('experiment')
@ApiTags('experiment')
export class ExperimentController {
  constructor(private readonly experimentService: ExperimentService) {}

  @Post()
  @ApiOperation({ summary: '创建实验' })
  @ApiBody({ type: CreateExperimentDto })
  create(@Body() createExperimentDto: CreateExperimentDto) {
    return this.experimentService.create(createExperimentDto);
  }

  // TODO 实现分页查询和条件查询排序
  @Get()
  findAll() {
    return this.experimentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experimentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExperimentDto: UpdateExperimentDto,
  ) {
    return this.experimentService.update(+id, updateExperimentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experimentService.remove(+id);
  }
}
