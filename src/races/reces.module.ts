import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/common';
import { Race } from './models/race.model';
import { RaceRepository } from './repositories/race.repository';
import { RacesService } from './races.service';
import { RacesController } from './races.controller';

@Module({
  imports: [DatabaseModule.forFeature([Race])],
  providers: [RaceRepository, RacesService],
  controllers: [RacesController],
  exports: [RaceRepository],
})
export class RacesModule {}
