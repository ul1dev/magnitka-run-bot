import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { TeamMembersService } from './team.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { AdminSecretGuard } from 'src/general/guards';

function imageOnlyFileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: Function,
) {
  if (/^image\//.test(file.mimetype)) cb(null, true);
  else cb(new BadRequestException('Можно загружать только изображения'), false);
}

@Controller('team')
export class TeamMembersController {
  constructor(private readonly service: TeamMembersService) {}

  // публичные
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  // защищённые
  @Post()
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor({ fileFilter: imageOnlyFileFilter }))
  create(
    @Body() body: CreateTeamMemberDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.create(body as any, files || []);
  }

  @Patch(':id')
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor({ fileFilter: imageOnlyFileFilter }))
  update(
    @Param('id') id: string,
    @Body() body: UpdateTeamMemberDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.update(id, body as any, files || []);
  }

  @Delete(':id')
  @UseGuards(AdminSecretGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
