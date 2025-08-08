import { Controller, Get, Param } from '@nestjs/common';
import { RacesService } from './races.service';

@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Get()
  findAll() {
    return this.racesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.racesService.findById(id);
  }
}
