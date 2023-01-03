import { PartialType } from '@nestjs/swagger';
import { CreateExperimentScoreDto } from './create-experiment_score.dto';

export class UpdateExperimentScoreDto extends PartialType(CreateExperimentScoreDto) {}
