import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExaminationSubmitService } from './examination_submit.service';
import { CreateExaminationSubmitDto } from './dto/create-examination_submit.dto';
import { UpdateExaminationSubmitDto } from './dto/update-examination_submit.dto';

@Controller('examination-submit')
export class ExaminationSubmitController {
  constructor(private readonly examinationSubmitService: ExaminationSubmitService) {}

  @Post()
  create(@Body() createExaminationSubmitDto: CreateExaminationSubmitDto) {
    return this.examinationSubmitService.create(createExaminationSubmitDto);
  }

  @Get()
  findAll() {
    return this.examinationSubmitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examinationSubmitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExaminationSubmitDto: UpdateExaminationSubmitDto) {
    return this.examinationSubmitService.update(+id, updateExaminationSubmitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examinationSubmitService.remove(+id);
  }
}
