import { Injectable, NotFoundException } from '@nestjs/common';
import { PacemakerRepository } from './repositories/pacemaker.repository';
import { Pacemaker } from './models/pacemaker.model';
import { S3StorageService } from 'src/libs/common';

type FilesMap = Record<string, Express.Multer.File[]>;

@Injectable()
export class PacemakersService {
  constructor(
    private readonly pacemakerRepository: PacemakerRepository,
    private readonly storage: S3StorageService,
  ) {}

  // READ
  findAll() {
    return this.pacemakerRepository.findAll({ order: [['createdAt', 'ASC']] });
  }

  async findById(id: string) {
    const doc = await this.pacemakerRepository.findByPk(id);
    if (!doc) throw new NotFoundException('Pacemaker not found');
    return doc;
  }

  // WRITE
  async create(data: Partial<Pacemaker>, files: Express.Multer.File[]) {
    const map = this.groupFiles(files);
    if (map.img?.[0]) data.img = await this.saveOne(map.img[0]);
    return this.pacemakerRepository.create(data as any);
  }

  async update(
    id: string,
    data: Partial<Pacemaker>,
    files: Express.Multer.File[],
  ) {
    const entity = await this.findById(id);
    const map = this.groupFiles(files);

    if (map.img?.[0]) {
      await this.deleteFile(entity.img); // удалить старую
      data.img = await this.saveOne(map.img[0]); // сохранить новую
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
