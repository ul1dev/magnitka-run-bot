import { IsArray, IsString } from 'class-validator';

export class DeleteGalleryImagesDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
