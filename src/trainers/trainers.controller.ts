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
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { AdminSecretGuard } from 'src/general/guards/admin-secret.guard';

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainersService: TrainersService) {}

  // PUBLIC
  @Get()
  findAll() {
    return this.trainersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.trainersService.findById(id);
  }

  @Post()
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() body: CreateTrainerDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.trainersService.create(body as any, files || []);
  }

  @Patch(':id')
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() body: UpdateTrainerDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.trainersService.update(id, body as any, files || []);
  }

  @Delete(':id')
  @UseGuards(AdminSecretGuard)
  remove(@Param('id') id: string) {
    return this.trainersService.remove(id);
  }
}
