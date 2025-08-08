import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  OrderProduct,
  OrderProductCreationArgs,
} from '../models/order-product.model';
import { FindOptions } from 'sequelize';
import { getUId } from 'src/libs/common/database/assets/getUId';

@Injectable()
export class OrderProductRepository extends AbstractRepository<
  OrderProduct,
  OrderProductCreationArgs
> {
  protected readonly logger = new Logger(OrderProduct.name);

  constructor(
    @InjectModel(OrderProduct) private orderProductModel: typeof OrderProduct,
  ) {
    super(orderProductModel);
  }

  async create(
    document: Omit<OrderProductCreationArgs, 'id'>,
  ): Promise<OrderProduct> {
    return (await this.model.create({
      ...document,
      id: getUId(),
    })) as OrderProduct;
  }

  async count(options?: FindOptions<OrderProduct>) {
    return this.model.count(options);
  }
}
