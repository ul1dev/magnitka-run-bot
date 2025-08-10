import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { OrderProductRepository } from './repositories/order-product.repository';
import { ShopProductRepository } from 'src/shop/repositories/shop-product.repository';
import { AlfaSbpService } from 'src/payments/alfa-sbp.service';
import { Order } from './models/order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { sendMessage } from 'src/general';
import { newOrderMarkup, newOrderMessage, paidOrderMarkup } from './responses';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrderRepository,
    private readonly orderProductsRepo: OrderProductRepository,
    private readonly productsRepo: ShopProductRepository,
    private readonly alfaSbp: AlfaSbpService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  // Публичный сценарий: создать заказ → вернуть order + paymentLink
  async create(data: CreateOrderDto) {
    // 1) Сумма заказа по актуальным ценам из БД
    const ids = [...new Set(data.products.map((p) => p.id))];
    const products = await this.productsRepo.findAll({ where: { id: ids } });

    const priceById = new Map(products.map((p) => [p.id, p.price]));
    let totalMinor = 0;

    for (const item of data.products) {
      const price = priceById.get(item.id);
      if (!price) throw new NotFoundException(`Product ${item.id} not found`);
      totalMinor += price * 100 * item.count; // рубли -> копейки
    }

    // 2) Создаём заказ
    const order = await this.ordersRepo.create({
      name: data.name,
      phone: data.phone,
      email: data.email,
      deliveryMethod: data.deliveryMethod,
      status: 'CREATED',
      provider: 'ALFA_SBP',
    });

    // 3) Добавляем позиции заказа (одной пачкой здесь не используем)
    for (const p of data.products) {
      await this.orderProductsRepo.create({
        orderId: order.id,
        productId: p.id,
        count: p.count,
        size: p.size,
      });
    }

    // 4) Регистрируем платёж в Альфе → получаем ссылку
    const webhookUrl =
      process.env.PAYMENTS_WEBHOOK_URL ||
      'https://your.domain/api/payments/alfasbp/webhook';

    // const pay = await this.alfaSbp.createPaymentLink({
    //   orderId: order.id,
    //   amountMinor: totalMinor,
    //   description: `Order ${order.id}`,
    //   customerEmail: data.email,
    //   webhookUrl,
    // });

    const pay = {
      paymentLink: 'https://google.com',
      paymentId: 'sdjhkfgjh23423',
    };

    await order.update({
      paymentLink: pay.paymentLink,
      providerPaymentId: pay.paymentId,
    });

    // 5) Вернуть полный заказ с позициями и ссылку
    const fullOrder = await this.ordersRepo.findById(order.id, {
      include: [
        { association: 'products', include: [{ association: 'product' }] },
      ],
    });

    if (fullOrder) {
      const message = await sendMessage(newOrderMessage(fullOrder), {
        bot: this.bot,
        chatId: process.env.ORDERS_CHAT_ID,
        type: 'send',
        reply_markup: newOrderMarkup(),
      });

      if (typeof message !== 'boolean' && message?.message_id) {
        await order.update({
          orderMessageId: String(message.message_id),
        });
      }
    }

    return {
      order: fullOrder as Order,
      paymentLink: pay.paymentLink,
    };
  }

  // Вызывается из вебхука: ставим статус PAID по ID платежа провайдера
  async markAsPaidByProviderPaymentId(providerPaymentId: string) {
    const [order] = await this.ordersRepo.findAll({
      where: { providerPaymentId },
      limit: 1,
    });

    if (!order) return;

    await order.update({ status: 'PAID' });

    if (order.orderMessageId) {
      try {
        this.bot.telegram.editMessageReplyMarkup(
          process.env.ORDERS_CHAT_ID,
          Number(order.orderMessageId),
          undefined,
          paidOrderMarkup(),
        );
      } catch (e) {}
    }

    return order;
  }
}
