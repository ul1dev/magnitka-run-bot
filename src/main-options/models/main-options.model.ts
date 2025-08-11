import { Column, DataType, Table } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';

export interface MainOptionsCreationArgs {
  regLink: string;
}

@Table({ tableName: 'MainOptions' })
export class MainOptions extends AbstractModel<
  MainOptions,
  MainOptionsCreationArgs
> {
  @Column({ type: DataType.STRING(2048), allowNull: false })
  declare regLink: string;
}
