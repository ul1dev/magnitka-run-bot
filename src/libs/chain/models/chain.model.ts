import { Column, Table, DataType, HasMany } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { ChainField } from './chain-field.model';

export interface ChainCreationArgs {
  type: string;
  userId: string;
  chatId: string;
  messageId: string;
  isCancel?: boolean;
  extraData?: string;
}

@Table({ tableName: 'Chains' })
export class Chain extends AbstractModel<Chain, ChainCreationArgs> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare type: string;

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
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare isCancel: boolean;

  @Column({
    type: DataType.STRING,
  })
  declare extraData?: string;

  @HasMany(() => ChainField)
  declare fields: ChainField[];
}
