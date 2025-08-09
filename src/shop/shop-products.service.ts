import { Injectable, NotFoundException } from '@nestjs/common';
import { ShopProductRepository } from './repositories/shop-product.repository';
import { ShopProduct } from './models/shop-product.model';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

type FilesMap = Record<string, Express.Multer.File[]>;

@Injectable()
export class ShopProductsService {
  constructor(private readonly repo: ShopProductRepository) {}

  findAll() {
    return this.repo.findAll({ order: [['createdAt', 'DESC']] });
  }

  async findById(id: string) {
    const doc = await this.repo.findByPk(id);
    if (!doc) throw new NotFoundException('Product not found');
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
    await this.deleteFiles(entity.imgs);
    await entity.destroy();
    return { ok: true };
  }

  private groupFiles(files: Express.Multer.File[]): FilesMap {
    const map: FilesMap = {};
    for (const f of files || []) (map[f.fieldname] ||= []).push(f);
    return map;
  }

  private async saveMany(files: Express.Multer.File[]): Promise<string[]> {
    const out: string[] = [];
    for (const f of files) out.push(await this.saveOne(f));
    return out;
  }

  private async saveOne(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.bin';
    const filename = `${randomUUID()}${ext}`;
    const dir = path.resolve(process.cwd(), 'static');
    await fs.promises.mkdir(dir, { recursive: true });

    const full = path.join(dir, filename);
    const data =
      file.buffer ??
      (file.path ? await fs.promises.readFile(file.path) : undefined);
    if (!data) throw new Error('Uploaded file has no data buffer');

    await fs.promises.writeFile(full, data);
    return `/static/${filename}`;
  }

  private async deleteFiles(values?: string[] | null) {
    const list = Array.isArray(values) ? values : [];
    await Promise.all(
      list.map(async (p) => {
        try {
          const m = p?.match(/^\/?static\/(.+)$/i);
          if (!m) return;
          const abs = path.join(process.cwd(), 'static', m[1]);
          await fs.promises.unlink(abs).catch(() => {});
        } catch {}
      }),
    );
  }
}
