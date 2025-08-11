import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { MainOptionsService } from './main-options.service';
import { CreateMainOptionsDto } from './dto/create-main-options.dto';
import { UpdateMainOptionsDto } from './dto/update-main-options.dto';
import { AdminSecretGuard } from 'src/general/guards';

@Controller('main-options')
export class MainOptionsController {
  constructor(private readonly service: MainOptionsService) {}

  @Get()
  get() {
    return this.service.get();
  }

  // публичное создание (один раз). Если хотите — можно тоже защитить.
  @Post()
  @UseGuards(AdminSecretGuard)
  create(@Body() dto: CreateMainOptionsDto) {
    return this.service.create(dto);
  }

  // защищённое изменение
  @Patch()
  @UseGuards(AdminSecretGuard)
  update(@Body() dto: UpdateMainOptionsDto) {
    return this.service.update(dto);
  }
}
