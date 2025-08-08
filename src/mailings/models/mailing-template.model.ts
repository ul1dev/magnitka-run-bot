import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { User } from 'src/users/models/user.model';

export type MailingTemplateType = 'admins' | 'global';

export interface MailingTemplateCreationArgs {
  id: string;
  messageId: string;
  userId?: string;
  type?: MailingTemplateType;
  status?: 'CREATING' | 'CREATED';
  title?: string;
  text?: string;
  animationFileId?: string;
  audioFileId?: string;
  documentFileId?: string;
  videoFileId?: string;
  photoFileId?: string;
  voiceFileId?: string;
  stickerFileId?: string;
}

@Table({ tableName: 'MailingTemplates' })
export class MailingTemplate extends AbstractModel<
  MailingTemplate,
  MailingTemplateCreationArgs
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
  })
  declare userId: string;

  @Column({
    type: DataType.STRING,
  })
  declare type: MailingTemplateType;

  @Column({
    type: DataType.STRING,
    defaultValue: 'CREATING',
  })
  declare status: 'CREATING' | 'CREATED';

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare messageId: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  declare usingCount: number;

  @Column({
    type: DataType.STRING,
  })
  declare title: string;

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
}
