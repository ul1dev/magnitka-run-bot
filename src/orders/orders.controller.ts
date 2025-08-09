import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

type CreateOrderItem = { id: string; count: number; size?: string };
type CreateOrderInput = {
  name: string;
  phone: string;
  email: string;
  deliveryMethod: string;
  products: CreateOrderItem[];
};

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() body: CreateOrderInput) {
    return this.ordersService.create(body);
  }
}
