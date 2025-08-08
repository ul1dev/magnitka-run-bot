import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Order } from './order.model';
import { ShopProduct } from 'src/shop/models/shop-product.model';

export interface OrderProductCreationArgs {
  orderId: string;
  productId: string;
  count: number;
  size?: string;
}

@Table({ tableName: 'OrderProducts' })
export class OrderProduct extends AbstractModel<
  OrderProduct,
  OrderProductCreationArgs
> {
  @ForeignKey(() => Order)
  @Column({ type: DataType.STRING, allowNull: false })
  declare orderId: string;

  @ForeignKey(() => ShopProduct)
  @Column({ type: DataType.STRING, allowNull: false })
  declare productId: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare count: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare size?: string;

  @BelongsTo(() => Order)
  declare order: Order;

  @BelongsTo(() => ShopProduct)
  declare product: ShopProduct;
}
