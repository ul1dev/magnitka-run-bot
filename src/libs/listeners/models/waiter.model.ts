import { Column, Table, DataType } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';

export interface WaiterCreationArgs {
  type: string;
  kind: string;
  userId: string;
  chatId: string;
  messageId: string;
  extraData?: string;
}

@Table({ tableName: 'Waiters' })
export class Waiter extends AbstractModel<Waiter, WaiterCreationArgs> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare type: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'text',
  })
  declare kind: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare chatId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare messageId: string;

  @Column({
    type: DataType.STRING,
  })
  declare extraData?: string;
}
