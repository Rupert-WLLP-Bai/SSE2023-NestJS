import { PartialType } from '@nestjs/mapped-types';
import { CreateExperimentSubmitDto } from './create-experiment_submit.dto';

export class UpdateExperimentSubmitDto extends PartialType(CreateExperimentSubmitDto) {}
