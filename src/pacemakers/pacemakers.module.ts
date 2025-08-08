import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/common';
import { PacemakersController } from './pacemakers.controller';
import { Pacemaker } from './models/pacemaker.model';
import { PacemakerRepository } from './repositories/pacemaker.repository';
import { PacemakersService } from './pacemakers.service';

@Module({
  imports: [DatabaseModule.forFeature([Pacemaker])],
  providers: [PacemakerRepository, PacemakersService],
  controllers: [PacemakersController],
})
export class PacemakersModule {}
