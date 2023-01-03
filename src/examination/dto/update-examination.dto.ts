import { PartialType } from '@nestjs/swagger';
import { CreateExaminationDto } from './create-examination.dto';

export class UpdateExaminationDto extends PartialType(CreateExaminationDto) {}
