import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

function toBool(value: any): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  const s = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(s)) return true;
  if (['false', '0', 'no', 'off'].includes(s)) return false;
  return undefined;
}

function parseJSON<T>(value: any): T | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'object') return value as T;
  try {
    return JSON.parse(String(value)) as T;
  } catch {
    return undefined;
  }
}

type PartnerMeta = { categoryText: string; link?: string };
type PressBlockMeta = { url: string };

export class CreateRaceDto {
  @IsString() title!: string;
  @IsString() regBtnUrl: string;
  @IsDateString()
  date!: string;

  @IsOptional() @IsString() cardTitle?: string;
  @IsOptional() @IsString() cardDates?: string;

  @IsOptional() @IsString() description!: string;

  @IsOptional()
  @Transform(({ value }) => toBool(value))
  @IsBoolean()
  isRegBtn?: boolean;

  @IsOptional() @IsString() regBtnTextColor?: string;
  @IsOptional() @IsString() regBtnBgColor?: string;
  @IsOptional() @IsString() regBtnBorderColor?: string;

  @IsOptional()
  @Transform(({ value }) => toBool(value))
  @IsBoolean()
  isMoreBtn?: boolean;

  @IsOptional() @IsString() moreBtnTextColor?: string;
  @IsOptional() @IsString() moreBtnBgColor?: string;
  @IsOptional() @IsString() moreBtnBorderColor?: string;

  @IsOptional() @IsString() bgColor?: string;

  @IsOptional()
  @IsIn(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'])
  btnsPosition?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';

  @IsOptional() @IsString() mainBgColor?: string;
  @IsOptional() @IsString() mainTextColor?: string;
  @IsOptional() @IsString() datesTextColor?: string;
  @IsOptional() @IsString() datesNumsText?: string;
  @IsOptional() @IsString() datesMonthText?: string;

  @IsOptional() @IsString() dateAndPlaceText!: string;

  @IsOptional() @IsString() participantPackageText?: string;

  @IsOptional() @IsString() routesText?: string;

  // Партнёры передаются JSON без картинок; файлы идут как partnerImg_<i>
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => parseJSON<PartnerMeta[]>(value))
  partners?: PartnerMeta[];

  // Пресс-блоки передаются JSON с url; файлы идут как pressBlockImg_<i>
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => parseJSON<PressBlockMeta[]>(value))
  pressBlocks?: PressBlockMeta[];
}
