import { IsString, IsUrl } from 'class-validator';

export class UpdateMainOptionsDto {
  @IsString()
  @IsUrl(
    { require_protocol: true },
    { message: 'regLink должен быть валидным URL с протоколом' },
  )
  regLink!: string;
}
