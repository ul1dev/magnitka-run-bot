import { forwardRef, Module } from '@nestjs/common';
import { AlfaSbpService } from './alfa-sbp.service';
import { AlfaSbpController } from './alfa-sbp.controller';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [AlfaSbpService],
  controllers: [AlfaSbpController],
  exports: [AlfaSbpService],
})
export class PaymentsModule {}
