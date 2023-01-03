import { PartialType } from '@nestjs/swagger';
import { CreateTotalWeightDto } from './create-total_weight.dto';

export class UpdateTotalWeightDto extends PartialType(CreateTotalWeightDto) {}
