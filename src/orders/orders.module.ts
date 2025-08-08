import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/common';
import { Order } from './models/order.model';
import { OrderProduct } from './models/order-product.model';
import { OrderRepository } from './repositories/order.repository';
import { OrderProductRepository } from './repositories/order-product.repository';

@Module({
  imports: [DatabaseModule.forFeature([Order, OrderProduct])],
  providers: [OrderRepository, OrderProductRepository],
})
export class OrdersModule {}
