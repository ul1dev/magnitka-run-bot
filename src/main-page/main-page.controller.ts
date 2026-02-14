import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { MainPageService } from './main-page.service';
import { AdminSecretGuard } from 'src/general/guards/admin-secret.guard';
import { DeleteGalleryImagesDto } from './dto/delete-gallery-images.dto';

@Controller('main-page')
export class MainPageController {
  constructor(private readonly mainPageService: MainPageService) {}

  /** GET /main-page — получить все поля */
  @Get()
  get() {
    return this.mainPageService.get();
  }

  /** PUT /main-page/main-bg — заменить mainBgImg (или добавить если нет) */
  @Put('main-bg')
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(FileInterceptor('mainBgImg'))
  replaceMainBg(@UploadedFile() file: Express.Multer.File) {
    return this.mainPageService.replaceMainBg(file);
  }

  /** POST /main-page/first-line — добавить файлы в первую линию */
  @Post('first-line')
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor())
  addFirstLine(@UploadedFiles() files: Express.Multer.File[]) {
    return this.mainPageService.addFirstLineImages(files || []);
  }

  /** POST /main-page/second-line — добавить файлы во вторую линию */
  @Post('second-line')
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor())
  addSecondLine(@UploadedFiles() files: Express.Multer.File[]) {
    return this.mainPageService.addSecondLineImages(files || []);
  }

  /** DELETE /main-page/first-line — удалить изображения по id из первой линии */
  @Delete('first-line')
  @UseGuards(AdminSecretGuard)
  removeFirstLine(@Body() dto: DeleteGalleryImagesDto) {
    return this.mainPageService.removeFirstLineImages(dto.ids);
  }

  /** DELETE /main-page/second-line — удалить изображения по id из второй линии */
  @Delete('second-line')
  @UseGuards(AdminSecretGuard)
  removeSecondLine(@Body() dto: DeleteGalleryImagesDto) {
    return this.mainPageService.removeSecondLineImages(dto.ids);
  }
}
