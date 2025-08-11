import { Column, DataType, Table } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';

export interface TeamMemberCreationArgs {
  name: string;
  description: string;
  img: string;
}

@Table({ tableName: 'TeamMembers' })
export class TeamMember extends AbstractModel<
  TeamMember,
  TeamMemberCreationArgs
> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare img: string;
}
