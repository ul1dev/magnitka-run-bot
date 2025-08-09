import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/common';
import { Order } from './models/order.model';
import { OrderProduct } from './models/order-product.model';
import { OrderRepository } from './repositories/order.repository';
import { OrderProductRepository } from './repositories/order-product.repository';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaymentsModule } from 'src/payments/payments.module';
import { ShopModule } from 'src/shop/shop.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Order, OrderProduct]),
    forwardRef(() => PaymentsModule),
    ShopModule,
  ],
  providers: [OrderRepository, OrderProductRepository, OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
