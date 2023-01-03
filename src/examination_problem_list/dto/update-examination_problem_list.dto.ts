import { PartialType } from '@nestjs/swagger';
import { CreateExaminationProblemListDto } from './create-examination_problem_list.dto';

export class UpdateExaminationProblemListDto extends PartialType(CreateExaminationProblemListDto) {}
