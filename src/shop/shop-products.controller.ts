import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ShopProductsService } from './shop-products.service';
import { CreateShopProductDto } from './dto/create-shop-product.dto';
import { UpdateShopProductDto } from './dto/update-shop-product.dto';
import { AdminSecretGuard } from 'src/general/guards/admin-secret.guard';

@Controller('shop/products')
export class ShopProductsController {
  constructor(private readonly service: ShopProductsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() body: CreateShopProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const hasImgs =
      Array.isArray(files) &&
      files.some((f) => f.fieldname === 'imgs' || f.fieldname === 'imgs[]');

    if (!hasImgs) {
      throw new BadRequestException(
        'imgs is required: send one or more files in form-data as "imgs[]"',
      );
    }

    return this.service.create(body as any, files || []);
  }

  @Patch(':id')
  @UseGuards(AdminSecretGuard)
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() body: UpdateShopProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.service.update(id, body as any, files || []);
  }

  @Delete(':id')
  @UseGuards(AdminSecretGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
