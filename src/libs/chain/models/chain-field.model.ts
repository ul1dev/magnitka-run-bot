import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Chain } from './chain.model';

export interface ChainFieldCreationArgs {
  chainId: string;
  serNum: number;
  title: string;
  text: string;
  isSkip?: boolean;
  cancelBtnCallbackData?: string;
  type?: 'text' | 'image' | 'file';
  validations?: string;
}

@Table({ tableName: 'ChainFields' })
export class ChainField extends AbstractModel<
  ChainField,
  ChainFieldCreationArgs
> {
  @ForeignKey(() => Chain)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare chainId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare serNum: number;

  @Column({
    type: DataType.STRING,
    defaultValue: 'text',
  })
  declare type: 'text' | 'image' | 'file';

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare text: string;

  @Column({
    type: DataType.STRING,
  })
  declare cancelBtnCallbackData: string;

  @Column({
    type: DataType.STRING,
  })
  declare validations?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isSkip: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isSkipped: boolean;

  @Column({
    type: DataType.BLOB,
  })
  declare userResponse?: string;
}
