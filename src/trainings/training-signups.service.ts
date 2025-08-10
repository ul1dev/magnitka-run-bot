import { Injectable } from '@nestjs/common';
import { CreateTrainingSignupDto } from './dto/create-training-signup.dto';
import { Context, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { sendMessage } from 'src/general';
import { newTrainingSignUpMessage } from './responses';

@Injectable()
export class TrainingSignupsService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  async create(dto: CreateTrainingSignupDto) {
    sendMessage(newTrainingSignUpMessage(dto), {
      bot: this.bot,
      chatId: process.env.TRAININGS_CHAT_ID,
      type: 'send',
    });
  }
}
