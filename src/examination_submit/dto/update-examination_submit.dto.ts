import { PartialType } from '@nestjs/swagger';
import { CreateExaminationSubmitDto } from './create-examination_submit.dto';

export class UpdateExaminationSubmitDto extends PartialType(
  CreateExaminationSubmitDto,
) {}
