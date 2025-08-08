import { Controller, Get, Param } from '@nestjs/common';
import { TrainersService } from './trainers.service';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  @Get()
  findAll() {
    return this.trainersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.trainersService.findById(id);
  }
}
