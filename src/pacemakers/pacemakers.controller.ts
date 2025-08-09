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
import { PacemakersService } from './pacemakers.service';
import { CreatePacemakerDto } from './dto/create-pacemaker.dto';
import { UpdatePacemakerDto } from './dto/update-pacemaker.dto';
import { AdminSecretGuard } from 'src/general/guards/admin-secret.guard';

@Controller('pacemakers')
export class PacemakersController {
  constructor(private readonly pacemakersService: PacemakersService) {}

  // PUBLIC
  @Get()
  findAll() {
    return this.pacemakersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.pacemakersService.findById(id);
  }

  // ADMIN (multipart/form-data)
  @Post()
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() body: CreatePacemakerDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.pacemakersService.create(body as any, files || []);
  }

  @Patch(':id')
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() body: UpdatePacemakerDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.pacemakersService.update(id, body as any, files || []);
  }

  @Delete(':id')
  @UseGuards(AdminSecretGuard)
  remove(@Param('id') id: string) {
    return this.pacemakersService.remove(id);
  }
}
