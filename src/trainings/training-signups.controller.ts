import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { TrainingSignupsService } from './training-signups.service';
import { CreateTrainingSignupDto } from './dto/create-training-signup.dto';

@Controller('trainings/signups')
export class TrainingSignupsController {
  constructor(private readonly service: TrainingSignupsService) {}

  @Post()
  @HttpCode(200)
  create(@Body() body: CreateTrainingSignupDto) {
    return this.service.create(body);
  }
}
