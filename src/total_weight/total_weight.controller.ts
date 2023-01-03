import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TotalWeightService } from './total_weight.service';
import { CreateTotalWeightDto } from './dto/create-total_weight.dto';
import { UpdateTotalWeightDto } from './dto/update-total_weight.dto';

@ApiTags('total-weight')
@Controller('total-weight')
export class TotalWeightController {
  constructor(private readonly totalWeightService: TotalWeightService) {}

  @Post()
  create(@Body() createTotalWeightDto: CreateTotalWeightDto) {
    return this.totalWeightService.create(createTotalWeightDto);
  }

  @Get()
  findAll() {
    return this.totalWeightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.totalWeightService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTotalWeightDto: UpdateTotalWeightDto,
  ) {
    return this.totalWeightService.update(+id, updateTotalWeightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.totalWeightService.remove(+id);
  }
}
