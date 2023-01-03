import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExaminationWeightService } from './examination_weight.service';
import { CreateExaminationWeightDto } from './dto/create-examination_weight.dto';
import { UpdateExaminationWeightDto } from './dto/update-examination_weight.dto';

@Controller('examination-weight')
export class ExaminationWeightController {
  constructor(private readonly examinationWeightService: ExaminationWeightService) {}

  @Post()
  create(@Body() createExaminationWeightDto: CreateExaminationWeightDto) {
    return this.examinationWeightService.create(createExaminationWeightDto);
  }

  @Get()
  findAll() {
    return this.examinationWeightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examinationWeightService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExaminationWeightDto: UpdateExaminationWeightDto) {
    return this.examinationWeightService.update(+id, updateExaminationWeightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examinationWeightService.remove(+id);
  }
}
