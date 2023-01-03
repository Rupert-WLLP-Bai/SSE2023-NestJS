import { PartialType } from '@nestjs/swagger';
import { CreateTotalScoreDto } from './create-total_score.dto';

export class UpdateTotalScoreDto extends PartialType(CreateTotalScoreDto) {}
