import { PartialType } from '@nestjs/swagger';
import { CreateExaminationScoreDto } from './create-examination_score.dto';

export class UpdateExaminationScoreDto extends PartialType(
  CreateExaminationScoreDto,
) {}
