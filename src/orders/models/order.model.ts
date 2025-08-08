import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { OrderProduct } from './order-product.model';

export type OrderStatus = 'CREATED' | 'PAID';

export interface OrderCreationArgs {
  name: string;
  phone: string;
  email: string;
  deliveryMethod: string;
  status?: OrderStatus;
  orderMessageId?: string;
}

@Table({ tableName: 'Orders' })
export class Order extends AbstractModel<Order, OrderCreationArgs> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare phone: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare deliveryMethod: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'CREATED',
  })
  declare status: OrderStatus;

  @Column({ type: DataType.STRING, allowNull: true })
  declare orderMessageId: string;

  @HasMany(() => OrderProduct, { foreignKey: 'orderId', as: 'products' })
  declare products: OrderProduct[];
}
