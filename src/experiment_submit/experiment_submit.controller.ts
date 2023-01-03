import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExperimentSubmitService } from './experiment_submit.service';
import { CreateExperimentSubmitDto } from './dto/create-experiment_submit.dto';
import { UpdateExperimentSubmitDto } from './dto/update-experiment_submit.dto';

@Controller('experiment-submit')
export class ExperimentSubmitController {
  constructor(private readonly experimentSubmitService: ExperimentSubmitService) {}

  @Post()
  create(@Body() createExperimentSubmitDto: CreateExperimentSubmitDto) {
    return this.experimentSubmitService.create(createExperimentSubmitDto);
  }

  @Get()
  findAll() {
    return this.experimentSubmitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experimentSubmitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExperimentSubmitDto: UpdateExperimentSubmitDto) {
    return this.experimentSubmitService.update(+id, updateExperimentSubmitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experimentSubmitService.remove(+id);
  }
}
