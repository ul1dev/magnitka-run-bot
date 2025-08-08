import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderCreationArgs } from '../models/order.model';
import { FindOptions } from 'sequelize';
import { getUId } from 'src/libs/common/database/assets/getUId';

@Injectable()
export class OrderRepository extends AbstractRepository<
  Order,
  OrderCreationArgs
> {
  protected readonly logger = new Logger(Order.name);

  constructor(@InjectModel(Order) private orderModel: typeof Order) {
    super(orderModel);
  }

  async create(document: Omit<OrderCreationArgs, 'id'>): Promise<Order> {
    return (await this.model.create({ ...document, id: getUId() })) as Order;
  }

  async findById(id: string, options?: FindOptions<Order>) {
    return this.model.findByPk(id, options) as Promise<Order | null>;
  }

  async count(options?: FindOptions<Order>) {
    return this.model.count(options);
  }
}
