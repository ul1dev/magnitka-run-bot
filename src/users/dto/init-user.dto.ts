import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class InitUserDto {
  @IsNotEmpty({ message: requestMessages.isNotEmpty('telegramId') })
  @IsString({ message: requestMessages.isString('telegramId') })
  telegramId: string;

  @IsOptional()
  @IsString({ message: requestMessages.isString('firstName') })
  firstName?: string;

  @IsOptional()
  @IsString({ message: requestMessages.isString('lastName') })
  lastName?: string;

  @IsOptional()
  @IsString({ message: requestMessages.isString('userName') })
  userName?: string;

  @IsOptional()
  @IsString({ message: requestMessages.isString('ip') })
  ip?: string;

  @IsOptional()
  @IsString({ message: requestMessages.isString('userAgent') })
  userAgent?: string;

  @IsOptional()
  @IsString({ message: requestMessages.isString('referralId') })
  referralId?: string;
}
