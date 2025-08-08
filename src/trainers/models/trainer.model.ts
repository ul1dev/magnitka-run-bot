import { Column, DataType, Table } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';

export interface TrainerCreationArgs {
  img?: string;
  name: string;
  description: string;
}

@Table({ tableName: 'Trainers' })
export class Trainer extends AbstractModel<Trainer, TrainerCreationArgs> {
  @Column({ type: DataType.STRING, allowNull: true }) declare img?: string;
  @Column({ type: DataType.STRING, allowNull: false }) declare name: string;
  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;
}
