import { IsString } from 'class-validator';

export class CreatePacemakerDto {
  @IsString() name!: string;
  @IsString() description!: string;
}
