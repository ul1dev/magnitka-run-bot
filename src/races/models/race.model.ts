import { Column, DataType, Table } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';

export interface RaceCreationArgs {
  title: string;
  date: string;

  cardTitle?: string;
  cardDates?: string;
  description?: string;
  isRegBtn?: boolean;
  regBtnUrl?: string;
  regBtnTextColor?: string;
  regBtnBgColor?: string;
  regBtnBorderColor?: string;
  isMoreBtn?: boolean;
  moreBtnTextColor?: string;
  moreBtnBgColor?: string;
  moreBtnBorderColor?: string;
  bgColor?: string;
  cardBgImg?: string;
  btnsPosition?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  mainBgImg?: string;
  mainBgColor?: string;
  mainTextColor?: string;
  datesTextColor?: string;
  datesNumsText?: string;
  datesMonthText?: string;
  aboutImgs?: string[];
  dateAndPlaceText?: string;
  participantPackageText?: string;
  participantPackageImgs?: string[];
  routesImgs?: string[];
  routesText?: string;
  partners?: { img: string; categoryText: string; link?: string }[];
  pressBlocks?: { img: string; url: string }[];
}

@Table({ tableName: 'Races' })
export class Race extends AbstractModel<Race, RaceCreationArgs> {
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare date: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare cardTitle?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare cardDates?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare isRegBtn?: boolean;
  @Column({ type: DataType.STRING, allowNull: true })
  declare regBtnUrl?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare regBtnTextColor?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare regBtnBgColor?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare regBtnBorderColor?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  declare isMoreBtn?: boolean;
  @Column({ type: DataType.STRING, allowNull: true })
  declare moreBtnTextColor?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare moreBtnBgColor?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare moreBtnBorderColor?: string;

  @Column({ type: DataType.STRING, allowNull: true }) declare bgColor?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare cardBgImg?: string;

  @Column({
    type: DataType.ENUM(
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
      'center',
    ),
    allowNull: true,
  })
  declare btnsPosition?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';

  @Column({ type: DataType.STRING, allowNull: true })
  declare mainBgImg?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare mainBgColor?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare mainTextColor?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare datesTextColor?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare datesNumsText?: string;
  @Column({ type: DataType.STRING, allowNull: true })
  declare datesMonthText?: string;

  @Column({ type: DataType.JSON, allowNull: true })
  declare aboutImgs?: string[];
  @Column({ type: DataType.STRING, allowNull: true })
  declare dateAndPlaceText: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  declare participantPackageText?: string;
  @Column({ type: DataType.JSON, allowNull: true })
  declare participantPackageImgs?: string[];
  @Column({ type: DataType.JSON, allowNull: true })
  declare routesImgs?: string[];
  @Column({ type: DataType.TEXT, allowNull: true }) declare routesText?: string;

  @Column({ type: DataType.JSON, allowNull: true })
  declare partners?: { img: string; categoryText: string; link?: string }[];

  @Column({ type: DataType.JSON, allowNull: true })
  declare pressBlocks?: { img: string; url: string }[];
}
