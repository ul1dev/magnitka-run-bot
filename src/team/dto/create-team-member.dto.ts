import { IsOptional, IsString } from 'class-validator';

export class CreateTeamMemberDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  img?: string;
}
