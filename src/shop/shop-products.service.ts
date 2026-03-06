import { Injectable, NotFoundException } from '@nestjs/common';
import { ShopProductRepository } from './repositories/shop-product.repository';
import { ShopProduct } from './models/shop-product.model';
import { S3StorageService } from 'src/libs/common';

type FilesMap = Record<string, Express.Multer.File[]>;

@Injectable()
export class ShopProductsService {
  constructor(
    private readonly repo: ShopProductRepository,
    private readonly storage: S3StorageService,
  ) {}

  findAll() {
    return this.repo.findAll({
      where: { isDeleted: false },
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: string) {
    const doc = await this.repo.findByPk(id);
    if (!doc || doc.isDeleted) throw new NotFoundException('Product not found');
    return doc;
  }

  async create(data: Partial<ShopProduct>, files: Express.Multer.File[]) {
    const map = this.groupFiles(files);
    if (map['imgs[]']?.length) data.imgs = await this.saveMany(map['imgs[]']);
    else if (map.imgs?.length) data.imgs = await this.saveMany(map.imgs);

    return this.repo.create(data as any);
  }

  async update(
    id: string,
    data: Partial<ShopProduct>,
    files: Express.Multer.File[],
  ) {
    const entity = await this.findById(id);
    const map = this.groupFiles(files);

    const incoming =
      (map['imgs[]']?.length ? map['imgs[]'] : undefined) ??
      (map.imgs?.length ? map.imgs : undefined);

    if (incoming?.length) {
      await this.deleteFiles(entity.imgs);
      data.imgs = await this.saveMany(incoming);
    }

    await entity.update({ ...data });
    return entity;
  }

  async remove(id: string) {
    const entity = await this.findById(id);
    await entity.update({ isDeleted: true });
    return { ok: true };
  }

  private groupFiles(files: Express.Multer.File[]): FilesMap {
    const map: FilesMap = {};
    for (const f of files || []) {
      const key = f.fieldname.replace(/\[\]$/, '');
      (map[key] ||= []).push(f);
    }
    return map;
  }

  private async saveMany(files: Express.Multer.File[]): Promise<string[]> {
    const out: string[] = [];
    for (const f of files) out.push(await this.saveOne(f));
    return out;
  }

  private async saveOne(file: Express.Multer.File): Promise<string> {
    return this.storage.uploadStatic(file, 'static');
  }

  private async deleteFiles(values?: string[] | null) {
    const list = Array.isArray(values) ? values : [];
    await Promise.all(list.map((p) => this.storage.deleteByPublicPath(p)));
  }
}
