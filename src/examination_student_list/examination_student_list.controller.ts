import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExaminationStudentListService } from './examination_student_list.service';
import { CreateExaminationStudentListDto } from './dto/create-examination_student_list.dto';
import { UpdateExaminationStudentListDto } from './dto/update-examination_student_list.dto';

@Controller('examination-student-list')
export class ExaminationStudentListController {
  constructor(private readonly examinationStudentListService: ExaminationStudentListService) {}

  @Post()
  create(@Body() createExaminationStudentListDto: CreateExaminationStudentListDto) {
    return this.examinationStudentListService.create(createExaminationStudentListDto);
  }

  @Get()
  findAll() {
    return this.examinationStudentListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examinationStudentListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExaminationStudentListDto: UpdateExaminationStudentListDto) {
    return this.examinationStudentListService.update(+id, updateExaminationStudentListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examinationStudentListService.remove(+id);
  }
}
