import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { RacesService } from './races.service';
import { CreateRaceDto } from './dto/create-race.dto';
import { AdminSecretGuard } from 'src/general/guards/admin-secret.guard';
import { UpdateRaceDto } from './dto/update-race.dto';

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

  @Post()
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() body: CreateRaceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.racesService.create(body as any, files || []);
  }

  @Patch(':id')
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() body: UpdateRaceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.racesService.update(id, body as any, files || []);
  }

  @Delete(':id')
  @UseGuards(AdminSecretGuard)
  remove(@Param('id') id: string) {
    return this.racesService.remove(id);
  }
}
