import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TotalScoreService } from './total_score.service';
import { CreateTotalScoreDto } from './dto/create-total_score.dto';
import { UpdateTotalScoreDto } from './dto/update-total_score.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('total-score')
@Controller('total-score')
export class TotalScoreController {
  constructor(private readonly totalScoreService: TotalScoreService) {}

  @Post()
  create(@Body() createTotalScoreDto: CreateTotalScoreDto) {
    return this.totalScoreService.create(createTotalScoreDto);
  }

  @Get()
  findAll() {
    return this.totalScoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.totalScoreService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTotalScoreDto: UpdateTotalScoreDto,
  ) {
    return this.totalScoreService.update(+id, updateTotalScoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.totalScoreService.remove(+id);
  }
}
