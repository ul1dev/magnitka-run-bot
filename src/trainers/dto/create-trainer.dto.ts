import { IsString } from 'class-validator';

export class CreateTrainerDto {
  @IsString() name!: string;
  @IsString() description!: string;
}
