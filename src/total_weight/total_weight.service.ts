import { Injectable } from '@nestjs/common';
import { CreateTotalWeightDto } from './dto/create-total_weight.dto';
import { UpdateTotalWeightDto } from './dto/update-total_weight.dto';

@Injectable()
export class TotalWeightService {
  create(createTotalWeightDto: CreateTotalWeightDto) {
    return 'This action adds a new totalWeight';
  }

  findAll() {
    return `This action returns all totalWeight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} totalWeight`;
  }

  update(id: number, updateTotalWeightDto: UpdateTotalWeightDto) {
    return `This action updates a #${id} totalWeight`;
  }

  remove(id: number) {
    return `This action removes a #${id} totalWeight`;
  }
}
