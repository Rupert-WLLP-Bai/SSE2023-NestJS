import { Injectable } from '@nestjs/common';
import { CreateTotalScoreDto } from './dto/create-total_score.dto';
import { UpdateTotalScoreDto } from './dto/update-total_score.dto';

@Injectable()
export class TotalScoreService {
  create(createTotalScoreDto: CreateTotalScoreDto) {
    return 'This action adds a new totalScore';
  }

  findAll() {
    return `This action returns all totalScore`;
  }

  findOne(id: number) {
    return `This action returns a #${id} totalScore`;
  }

  update(id: number, updateTotalScoreDto: UpdateTotalScoreDto) {
    return `This action updates a #${id} totalScore`;
  }

  remove(id: number) {
    return `This action removes a #${id} totalScore`;
  }
}
