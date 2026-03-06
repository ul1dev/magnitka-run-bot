import { Injectable, NotFoundException } from '@nestjs/common';
import { TrainerRepository } from './repositories/trainer.repository';
import { Trainer } from './models/trainer.model';
import { S3StorageService } from 'src/libs/common';

type FilesMap = Record<string, Express.Multer.File[]>;

@Injectable()
export class TrainersService {
  constructor(
    private readonly trainerRepository: TrainerRepository,
    private readonly storage: S3StorageService,
  ) {}

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
    return this.storage.uploadStatic(file, 'static');
  }

  private async deleteFile(publicPath?: string) {
    await this.storage.deleteByPublicPath(publicPath);
  }
}
