import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/common';
import { ShopProduct } from './models/shop-product.model';
import { ShopProductRepository } from './repositories/shop-product.repository';
import { ShopProductsService } from './shop-products.service';
import { ShopProductsController } from './shop-products.controller';

@Module({
  imports: [DatabaseModule.forFeature([ShopProduct])],
  providers: [ShopProductRepository, ShopProductsService],
  controllers: [ShopProductsController],
  exports: [ShopProductRepository],
})
export class ShopModule {}
