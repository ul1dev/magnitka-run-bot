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
  paymentLink?: string;
  providerPaymentId?: string;
  provider?: 'ALFA_SBP';
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

  @Column({ type: DataType.STRING })
  declare paymentLink?: string;

  @Column({ type: DataType.STRING })
  declare providerPaymentId?: string;

  @Column({ type: DataType.STRING })
  declare provider?: 'ALFA_SBP';

  @HasMany(() => OrderProduct, { foreignKey: 'orderId', as: 'products' })
  declare products: OrderProduct[];
}
