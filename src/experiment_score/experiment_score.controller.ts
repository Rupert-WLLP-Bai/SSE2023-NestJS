import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExperimentScoreService } from './experiment_score.service';
import { CreateExperimentScoreDto } from './dto/create-experiment_score.dto';
import { UpdateExperimentScoreDto } from './dto/update-experiment_score.dto';

@Controller('experiment-score')
export class ExperimentScoreController {
  constructor(private readonly experimentScoreService: ExperimentScoreService) {}

  @Post()
  create(@Body() createExperimentScoreDto: CreateExperimentScoreDto) {
    return this.experimentScoreService.create(createExperimentScoreDto);
  }

  @Get()
  findAll() {
    return this.experimentScoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experimentScoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExperimentScoreDto: UpdateExperimentScoreDto) {
    return this.experimentScoreService.update(+id, updateExperimentScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experimentScoreService.remove(+id);
  }
}
