import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExaminationScoreService } from './examination_score.service';
import { CreateExaminationScoreDto } from './dto/create-examination_score.dto';
import { UpdateExaminationScoreDto } from './dto/update-examination_score.dto';

@Controller('examination-score')
export class ExaminationScoreController {
  constructor(private readonly examinationScoreService: ExaminationScoreService) {}

  @Post()
  create(@Body() createExaminationScoreDto: CreateExaminationScoreDto) {
    return this.examinationScoreService.create(createExaminationScoreDto);
  }

  @Get()
  findAll() {
    return this.examinationScoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examinationScoreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExaminationScoreDto: UpdateExaminationScoreDto) {
    return this.examinationScoreService.update(+id, updateExaminationScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examinationScoreService.remove(+id);
  }
}
