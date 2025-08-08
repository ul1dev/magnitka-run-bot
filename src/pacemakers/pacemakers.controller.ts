import { Controller, Get, Param } from '@nestjs/common';
import { PacemakersService } from './pacemakers.service';

@Controller('pacemakers')
export class PacemakersController {
  constructor(private readonly pacemakersService: PacemakersService) {}

  @Get()
  findAll() {
    return this.pacemakersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.pacemakersService.findById(id);
  }
}
