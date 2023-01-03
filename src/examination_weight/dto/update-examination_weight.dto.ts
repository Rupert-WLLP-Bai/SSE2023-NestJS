import { PartialType } from '@nestjs/swagger';
import { CreateExaminationWeightDto } from './create-examination_weight.dto';

export class UpdateExaminationWeightDto extends PartialType(CreateExaminationWeightDto) {}
