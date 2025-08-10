import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

function toBool(v: any): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.toLowerCase() === 'true';
  return !!v;
}

export class CreateTrainingSignupDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  directions!: string;

  @IsString()
  level!: string;

  @IsISO8601()
  datetime!: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @Transform(({ value }) => toBool(value))
  @IsBoolean()
  consent!: boolean;
}
