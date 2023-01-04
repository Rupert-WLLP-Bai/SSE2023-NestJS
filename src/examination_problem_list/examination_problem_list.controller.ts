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
import { ExaminationProblemListService } from './examination_problem_list.service';
import { CreateExaminationProblemListDto } from './dto/create-examination_problem_list.dto';
import { UpdateExaminationProblemListDto } from './dto/update-examination_problem_list.dto';

@Controller('examination-problem-list')
@ApiTags('examination-problem-list')
export class ExaminationProblemListController {
  constructor(
    private readonly examinationProblemListService: ExaminationProblemListService,
  ) {}

  @Post()
  create(
    @Body() createExaminationProblemListDto: CreateExaminationProblemListDto,
  ) {
    return this.examinationProblemListService.create(
      createExaminationProblemListDto,
    );
  }

  @Get()
  findAll() {
    return this.examinationProblemListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examinationProblemListService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExaminationProblemListDto: UpdateExaminationProblemListDto,
  ) {
    return this.examinationProblemListService.update(
      +id,
      updateExaminationProblemListDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examinationProblemListService.remove(+id);
  }
}
