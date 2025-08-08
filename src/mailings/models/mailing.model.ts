import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { User } from 'src/users/models/user.model';

export interface MailingCreationArgs {
  userId: string;
  chatId: string;
  messageId: string;
  status?: 'CREATING' | 'CONFIRMING' | 'WAIT_SENDING' | 'SENDING';
  text?: string;
  animationFileId?: string;
  audioFileId?: string;
  documentFileId?: string;
  videoFileId?: string;
  photoFileId?: string;
  voiceFileId?: string;
  stickerFileId?: string;
}

@Table({ tableName: 'Mailings' })
export class Mailing extends AbstractModel<Mailing, MailingCreationArgs> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare userId: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'CREATING',
  })
  declare status: 'CREATING' | 'CONFIRMING' | 'WAIT_SENDING' | 'SENDING';

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
  declare text: string;

  @Column({
    type: DataType.STRING,
  })
  declare animationFileId: string;

  @Column({
    type: DataType.STRING,
  })
  declare audioFileId: string;

  @Column({
    type: DataType.STRING,
  })
  declare documentFileId: string;

  @Column({
    type: DataType.STRING,
  })
  declare videoFileId: string;

  @Column({
    type: DataType.STRING,
  })
  declare photoFileId: string;

  @Column({
    type: DataType.STRING,
  })
  declare voiceFileId: string;

  @Column({
    type: DataType.STRING,
  })
  declare stickerFileId: string;

  @BelongsTo(() => User)
  declare user: User;
}
