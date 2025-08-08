import { Controller, Get, Param } from '@nestjs/common';
import { ShopProductsService } from './shop-products.service';

@Controller('shop/products')
export class ShopProductsController {
  constructor(private readonly shopProductsService: ShopProductsService) {}

  @Get()
  findAll() {
    return this.shopProductsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.shopProductsService.findById(id);
  }
}
