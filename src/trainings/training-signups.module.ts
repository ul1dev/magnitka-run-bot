import { Module } from '@nestjs/common';
import { TrainingSignupsController } from './training-signups.controller';
import { TrainingSignupsService } from './training-signups.service';

@Module({
  controllers: [TrainingSignupsController],
  providers: [TrainingSignupsService],
})
export class TrainingSignupsModule {}
