import { IsDateString } from 'class-validator';

export class UpdateMainTimerDateDto {
  @IsDateString()
  mainTimerDate!: string;
}
