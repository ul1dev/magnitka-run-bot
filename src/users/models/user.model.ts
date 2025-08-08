import { Column, Table, DataType, HasMany } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { UserRoles } from 'src/roles/models/user-roles.model';

export interface UserCreationArgs {
  telegramId: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  ip?: string;
  userAgent?: string;
}

@Table({ tableName: 'Users' })
export class User extends AbstractModel<User, UserCreationArgs> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare telegramId: string;

  @Column({
    type: DataType.STRING,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING,
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING,
  })
  declare userName: string;

  @Column({
    type: DataType.STRING,
  })
  declare ip: string;

  @Column({
    type: DataType.STRING,
  })
  declare userAgent: string;

  @HasMany(() => UserRoles, { foreignKey: 'userId', as: 'roles' })
  declare roles: UserRoles[];
}
