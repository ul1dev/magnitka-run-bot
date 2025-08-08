import { Injectable, NotFoundException } from '@nestjs/common';
import { ShopProductRepository } from './repositories/shop-product.repository';

@Injectable()
export class ShopProductsService {
  constructor(private readonly productRepository: ShopProductRepository) {}

  findAll() {
    return this.productRepository.findAll({ order: [['createdAt', 'DESC']] });
  }

  async findById(id: string) {
    const doc = await this.productRepository.findByPk(id);
    if (!doc) throw new NotFoundException('Product not found');
    return doc;
  }
}
