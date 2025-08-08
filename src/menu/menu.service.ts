import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { menuMarkup, menuMessage } from './responses';
import { sendMessage } from 'src/general';

@Injectable()
export class MenuService {
  async sendMenu(ctx: Context) {
    await sendMessage(menuMessage(), {
      ctx,
      reply_markup: menuMarkup(),
      type: 'send',
    });
  }

  async changeToMenu(ctx: Context) {
    await sendMessage(menuMessage(), {
      ctx,
      reply_markup: menuMarkup(),
    });
  }
}
