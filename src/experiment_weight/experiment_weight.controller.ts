import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExperimentWeightService } from './experiment_weight.service';
import { CreateExperimentWeightDto } from './dto/create-experiment_weight.dto';
import { UpdateExperimentWeightDto } from './dto/update-experiment_weight.dto';

@Controller('experiment-weight')
@ApiTags('experiment-weight')
export class ExperimentWeightController {
  constructor(
    private readonly experimentWeightService: ExperimentWeightService,
  ) {}

  @Post()
  create(@Body() createExperimentWeightDto: CreateExperimentWeightDto) {
    return this.experimentWeightService.create(createExperimentWeightDto);
  }

  @Get()
  findAll() {
    return this.experimentWeightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experimentWeightService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExperimentWeightDto: UpdateExperimentWeightDto,
  ) {
    return this.experimentWeightService.update(+id, updateExperimentWeightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experimentWeightService.remove(+id);
  }
}
