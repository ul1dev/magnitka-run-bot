import { Injectable, NotFoundException } from '@nestjs/common';
import { TrainerRepository } from './repositories/trainer.repository';
import { Trainer } from './models/trainer.model';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

type FilesMap = Record<string, Express.Multer.File[]>;

@Injectable()
export class TrainersService {
  constructor(private readonly trainerRepository: TrainerRepository) {}

  // READ
  findAll() {
    return this.trainerRepository.findAll({ order: [['createdAt', 'ASC']] });
  }

  async findById(id: string) {
    const doc = await this.trainerRepository.findByPk(id);
    if (!doc) throw new NotFoundException('Trainer not found');
    return doc;
  }

  // WRITE
  async create(data: Partial<Trainer>, files: Express.Multer.File[]) {
    const map = this.groupFiles(files);
    if (map.img?.[0]) data.img = await this.saveOne(map.img[0]);
    return this.trainerRepository.create(data as any);
  }

  async update(
    id: string,
    data: Partial<Trainer>,
    files: Express.Multer.File[],
  ) {
    const entity = await this.findById(id);
    const map = this.groupFiles(files);

    if (map.img?.[0]) {
      await this.deleteFile(entity.img);
      data.img = await this.saveOne(map.img[0]); // полная замена
    }

    await entity.update({ ...data });
    return entity;
  }

  async remove(id: string) {
    const entity = await this.findById(id);
    await this.deleteFile(entity.img);
    await entity.destroy();
    return { ok: true };
  }

  // helpers
  private groupFiles(files: Express.Multer.File[]): FilesMap {
    const map: FilesMap = {};
    for (const f of files || []) (map[f.fieldname] ||= []).push(f);
    return map;
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

  private async deleteFile(publicPath?: string) {
    if (!publicPath) return;
    const m = publicPath.match(/^\/?static\/(.+)$/i);
    if (!m) return;
    const abs = path.join(process.cwd(), 'static', m[1]);
    await fs.promises.unlink(abs).catch(() => {});
  }
}
