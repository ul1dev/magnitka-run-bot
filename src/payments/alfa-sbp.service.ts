import { Injectable, Logger } from '@nestjs/common';

type CreatePaymentArgs = {
  orderId: string;
  amountMinor: number;
  description?: string;
  customerEmail?: string;
  webhookUrl: string;
};

type CreatePaymentResult = {
  paymentId: string;
  paymentLink: string;
};

@Injectable()
export class AlfaSbpService {
  private readonly logger = new Logger(AlfaSbpService.name);
  private readonly base =
    process.env.ALFA_API_BASE || 'https://api.alfabank.ru';
  private readonly token = process.env.ALFA_SBP_TOKEN!;
  private readonly terminalId = process.env.ALFA_SBP_TERMINAL_ID!;

  async createPaymentLink(
    args: CreatePaymentArgs,
  ): Promise<CreatePaymentResult> {
    const url = `${this.base}/sbp/jp/v1/qrcs`;

    const payload = {
      order: {
        id: args.orderId,
        description: args.description ?? `Order ${args.orderId}`,
        amount: { value: args.amountMinor, currency: 'RUB' },
      },
      merchant: { terminal_id: this.terminalId },
      notification_url: args.webhookUrl,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      this.logger.error(
        `Alfa SBP createPaymentLink failed: ${res.status} ${txt}`,
      );
      throw new Error('Failed to create SBP payment link');
    }

    const data = (await res.json()) as any;
    return {
      paymentId: String(data?.order_id ?? data?.id ?? args.orderId),
      paymentLink: String(data?.payment_link ?? data?.qrLink ?? data?.deeplink),
    };
  }
}
