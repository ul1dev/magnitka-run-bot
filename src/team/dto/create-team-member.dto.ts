import { IsOptional, IsString } from 'class-validator';

export class CreateTeamMemberDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  img?: string;
}
