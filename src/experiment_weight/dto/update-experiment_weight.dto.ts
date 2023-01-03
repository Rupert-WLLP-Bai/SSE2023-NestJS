import { PartialType } from '@nestjs/swagger';
import { CreateExperimentWeightDto } from './create-experiment_weight.dto';

export class UpdateExperimentWeightDto extends PartialType(CreateExperimentWeightDto) {}
