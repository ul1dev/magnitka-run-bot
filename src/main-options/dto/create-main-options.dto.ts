import { IsString, IsUrl } from 'class-validator';

export class CreateMainOptionsDto {
  @IsString()
  @IsUrl(
    { require_protocol: true },
    { message: 'regLink должен быть валидным URL с протоколом' },
  )
  regLink!: string;
}
