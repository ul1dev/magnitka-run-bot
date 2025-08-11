import { Column, DataType, Default, Table } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';

export interface ShopProductCreationArgs {
  article: string;
  price: number;
  title: string;
  info: string;
  imgs: string[];
  discountProcent?: number;
  description?: string;
  sizesTitle?: string;
  sizes?: { isUnavailable: boolean; value: string }[];
}

@Table({ tableName: 'ShopProducts' })
export class ShopProduct extends AbstractModel<
  ShopProduct,
  ShopProductCreationArgs
> {
  @Column({ type: DataType.STRING, allowNull: false }) declare article: string;
  @Column({ type: DataType.INTEGER, allowNull: false }) declare price: number;
  @Column({ type: DataType.STRING, allowNull: false }) declare title: string;
  @Column({ type: DataType.TEXT, allowNull: false }) declare info: string;
  @Column({ type: DataType.JSON, allowNull: false }) declare imgs: string[];
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare discountProcent?: number;
  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare sizesTitle?: string;
  @Column({ type: DataType.JSON, allowNull: true }) declare sizes?: {
    isUnavailable: boolean;
    value: string;
  }[];

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isDeleted: boolean;
}
