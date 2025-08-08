import { Column, DataType, Table } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';

export interface PacemakerCreationArgs {
  img?: string;
  name: string;
  description: string;
}

@Table({ tableName: 'Pacemakers' })
export class Pacemaker extends AbstractModel<Pacemaker, PacemakerCreationArgs> {
  @Column({ type: DataType.STRING, allowNull: true }) declare img?: string;
  @Column({ type: DataType.STRING, allowNull: false }) declare name: string;
  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;
}
