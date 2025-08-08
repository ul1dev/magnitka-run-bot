import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ShopProduct,
  ShopProductCreationArgs,
} from '../models/shop-product.model';
import { FindOptions } from 'sequelize';
import { getUId } from 'src/libs/common/database/assets/getUId';

@Injectable()
export class ShopProductRepository extends AbstractRepository<
  ShopProduct,
  ShopProductCreationArgs
> {
  protected readonly logger = new Logger(ShopProduct.name);

  constructor(
    @InjectModel(ShopProduct) private shopProductModel: typeof ShopProduct,
  ) {
    super(shopProductModel);
  }

  async create(
    document: Omit<ShopProductCreationArgs, 'id'>,
  ): Promise<ShopProduct> {
    return (await this.model.create({
      ...document,
      id: getUId(),
    })) as ShopProduct;
  }

  async count(options?: FindOptions<ShopProduct>) {
    return this.model.count(options);
  }
}
