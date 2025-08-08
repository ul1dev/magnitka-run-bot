import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/common';
import { Trainer } from './models/trainer.model';
import { TrainerRepository } from './repositories/trainer.repository';
import { TrainersService } from './trainers.service';
import { TrainersController } from './trainers.controller';

@Module({
  imports: [DatabaseModule.forFeature([Trainer])],
  providers: [TrainerRepository, TrainersService],
  controllers: [TrainersController],
})
export class TrainersModule {}
