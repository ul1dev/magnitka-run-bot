import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { OrdersService } from 'src/orders/orders.service';

@Controller('payments/alfasbp')
export class AlfaSbpController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('webhook')
  @SkipThrottle()
  @HttpCode(200)
  async webhook(@Body() body: any) {
    const providerPaymentId = String(
      body?.order_id ?? body?.paymentId ?? body?.orderId ?? body?.id ?? '',
    );
    const status = String(
      body?.status ?? body?.payment_status ?? body?.state ?? '',
    ).toUpperCase();

    if (!providerPaymentId) return { ok: true };
    if (['SUCCESS', 'PAID', 'CONFIRMED', 'COMPLETED'].includes(status)) {
      await this.ordersService.markAsPaidByProviderPaymentId(providerPaymentId);
    }
    return { ok: true };
  }
}
