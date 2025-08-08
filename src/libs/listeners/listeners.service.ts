import { Injectable } from '@nestjs/common';
import { WaitersRepository } from './repositories/waiter.repository';
import { GeneralValidations } from 'src/general/general.validations';
import { Context, Telegraf } from 'telegraf';
import { getCtxData } from 'src/libs/common';
import { UserRepository } from 'src/users/repositories/user.repository';
import { sendMessage } from 'src/general';
import { InjectBot } from 'nestjs-telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { MailingRepository } from 'src/mailings/repositories/mailing.repository';
import { MailingTemplateRepository } from 'src/mailings/repositories/mailing-template.repository';

interface CreateWaiterArgs {
  type: string;
  kind?: string;
  userId?: string;
  chatId?: string;
  messageId?: string;
  extraData?: string;
}

@Injectable()
export class ListenersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly waitersRepository: WaitersRepository,
    private readonly generalValidations: GeneralValidations,
    private readonly mailingRepository: MailingRepository,
    private readonly mailingTemplateRepository: MailingTemplateRepository,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async clearUserListeners(userTgId: string) {
    const user = await this.userRepository.findByTgId(userTgId);

    if (user) {
      await this.waitersRepository.destroy({ where: { userId: user.id } });
      await this.mailingRepository.destroy({
        where: { userId: user.id, status: 'CREATING' },
      });
      await this.mailingTemplateRepository.destroy({
        where: { userId: user.id, status: 'CREATING' },
      });
    }
  }

  async onTextMessage(ctx: Context) {
    if (ctx?.chat?.type !== 'private') return;

    const { message, ctxUser } = getCtxData(ctx);
    const userTgId = ctxUser.id;

    const user = await this.userRepository.findByTgId(userTgId);
    const userId = user?.id;
    const textWaiter = await this.waitersRepository.findOne({
      where: { userId, kind: 'text' },
    });

    if (!textWaiter) return;

    try {
      await ctx.deleteMessage();
    } catch (e) {}

    const { type, extraData, chatId, messageId } = textWaiter;
    const text = message.text?.trim();

    let finishMessage: {
      text: string;
      markup?: InlineKeyboardMarkup;
    } = { text: '' };
    let isDeleteFinishMesssage: boolean = false;

    if (type === 'something') {
      // do something
    }

    await this.waitersRepository.destroy({ where: { userId } });

    if (finishMessage) {
      await sendMessage(finishMessage.text, {
        bot: this.bot,
        chatId,
        messageId: +messageId,
        reply_markup: finishMessage.markup,
      });
    }

    if (isDeleteFinishMesssage) {
      try {
        await this.bot.telegram.deleteMessage(chatId, +messageId);
      } catch (e) {}
    }
  }

  async onFileMessage(ctx: Context) {
    if (ctx?.chat?.type !== 'private') return;

    const { message, ctxUser } = getCtxData(ctx);
    const userTgId = ctxUser.id;

    const user = await this.userRepository.findByTgId(userTgId);
    const userId = user?.id;
    const fileWaiter = await this.waitersRepository.findOne({
      where: { userId, kind: 'file' },
    });

    if (!fileWaiter) return;

    try {
      await ctx.deleteMessage();
    } catch (e) {}

    const { type, extraData, chatId, messageId } = fileWaiter;
    const document = message.document;

    let finishMessage: {
      text: string;
      markup?: InlineKeyboardMarkup;
    } = { text: '' };

    const url = await ctx.telegram.getFileLink(document.file_id);
    const text = await (await fetch(url)).text();

    if (type === 'some') {
      // do something
    }

    await this.waitersRepository.destroy({ where: { userId } });

    if (finishMessage) {
      await sendMessage(finishMessage.text, {
        bot: this.bot,
        chatId,
        messageId: +messageId,
        reply_markup: finishMessage.markup,
      });
    }
  }

  async createWaiter(createArgs: CreateWaiterArgs, ctx?: Context) {
    let userId = createArgs?.userId ?? '';
    let chatId = createArgs?.chatId ?? '';
    let messageId = createArgs?.messageId ?? '';
    let extraData = createArgs?.extraData;

    if (ctx) {
      const { ctxUser, message } = getCtxData(ctx);
      const userTgId = ctxUser.id;
      const user = await this.userRepository.findByTgId(userTgId);

      userId = user?.id;
      chatId = message?.chat?.id;
      messageId = message?.message_id;
    }

    await this.waitersRepository.create({
      type: createArgs.type,
      kind: createArgs.kind ?? '',
      userId,
      chatId,
      messageId,
      extraData,
    });
  }
}
