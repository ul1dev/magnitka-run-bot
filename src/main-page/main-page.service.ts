import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MainPageRepository } from './repositories/main-page.repository';
import { MainPage, GalleryImage } from './models/main-page.model';
import * as fs from 'fs';
import imageSize from 'image-size';
import { S3StorageService } from 'src/libs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class MainPageService {
  constructor(
    private readonly mainPageRepository: MainPageRepository,
    private readonly storage: S3StorageService,
  ) {}

  /** Получить единственную запись (синглтон) или null */
  private async getSingleton(): Promise<MainPage | null> {
    return this.mainPageRepository.findOne({});
  }

  /** Гарантированно получить запись — создать пустую, если нет */
  private async getOrCreate(): Promise<MainPage> {
    let entity = await this.getSingleton();
    if (!entity) {
      entity = await this.mainPageRepository.create({
        mainBgImg: null,
        galleryFirstLineImgs: null,
        gallerySecondLineImgs: null,
        mainTimerDate: `${new Date().getFullYear()}-09-07`,
      });
    }
    return entity;
  }

  // ─────────── GET ───────────

  async get() {
    const entity = await this.getSingleton();
    if (!entity) {
      return {
        mainBgImg: null,
        galleryFirstLineImgs: null,
        gallerySecondLineImgs: null,
        mainTimerDate: `${new Date().getFullYear()}-09-07`,
      };
    }
    return entity;
  }

  // ─────────── PUT /main-page/main-timer-date ───────────

  async updateMainTimerDate(mainTimerDate: string) {
    const entity = await this.getOrCreate();
    await entity.update({ mainTimerDate });
    return entity;
  }

  // ─────────── PUT /main-page/main-bg ───────────

  async replaceMainBg(file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Файл mainBgImg не передан');

    const entity = await this.getOrCreate();

    // удалить старую картинку
    if (entity.mainBgImg) {
      await this.deleteFile(entity.mainBgImg);
    }

    const saved = await this.saveOne(file);
    await entity.update({ mainBgImg: saved });
    return entity;
  }

  // ─────────── POST /main-page/first-line ───────────

  async addFirstLineImages(files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new BadRequestException('Файлы не переданы');
    }

    const entity = await this.getOrCreate();
    const existing: GalleryImage[] = entity.galleryFirstLineImgs ?? [];

    const maxOrder = existing.length
      ? Math.max(...existing.map((i) => i.order))
      : 0;

    const newImages = await this.buildGalleryImages(files, maxOrder);
    const merged = [...existing, ...newImages];

    await entity.update({ galleryFirstLineImgs: merged });
    return entity;
  }

  // ─────────── POST /main-page/second-line ───────────

  async addSecondLineImages(files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new BadRequestException('Файлы не переданы');
    }

    const entity = await this.getOrCreate();
    const existing: GalleryImage[] = entity.gallerySecondLineImgs ?? [];

    const maxOrder = existing.length
      ? Math.max(...existing.map((i) => i.order))
      : 0;

    const newImages = await this.buildGalleryImages(files, maxOrder);
    const merged = [...existing, ...newImages];

    await entity.update({ gallerySecondLineImgs: merged });
    return entity;
  }

  // ─────────── DELETE /main-page/first-line ───────────

  async removeFirstLineImages(ids: string[]) {
    if (!ids?.length) {
      throw new BadRequestException('Список id не передан');
    }

    const entity = await this.getOrCreate();
    const existing: GalleryImage[] = entity.galleryFirstLineImgs ?? [];

    const idsSet = new Set(ids);
    const toDelete = existing.filter((img) => idsSet.has(img.id));
    const remaining = existing.filter((img) => !idsSet.has(img.id));

    // удалить файлы
    await Promise.all(toDelete.map((img) => this.deleteFile(img.src)));

    await entity.update({
      galleryFirstLineImgs: remaining.length ? remaining : null,
    });
    return entity;
  }

  // ─────────── DELETE /main-page/second-line ───────────

  async removeSecondLineImages(ids: string[]) {
    if (!ids?.length) {
      throw new BadRequestException('Список id не передан');
    }

    const entity = await this.getOrCreate();
    const existing: GalleryImage[] = entity.gallerySecondLineImgs ?? [];

    const idsSet = new Set(ids);
    const toDelete = existing.filter((img) => idsSet.has(img.id));
    const remaining = existing.filter((img) => !idsSet.has(img.id));

    // удалить файлы
    await Promise.all(toDelete.map((img) => this.deleteFile(img.src)));

    await entity.update({
      gallerySecondLineImgs: remaining.length ? remaining : null,
    });
    return entity;
  }

  // ─────────── helpers ───────────

  private async buildGalleryImages(
    files: Express.Multer.File[],
    startOrder: number,
  ): Promise<GalleryImage[]> {
    const images: GalleryImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const src = await this.saveOne(files[i]);
      const width = this.getImageWidth(files[i]);
      images.push({
        id: randomUUID(),
        src,
        size: width,
        order: startOrder + i + 1,
      });
    }

    return images;
  }

  /** Определить ширину изображения в пикселях */
  private getImageWidth(file: Express.Multer.File): number {
    try {
      const buffer =
        file.buffer ?? (file.path ? fs.readFileSync(file.path) : undefined);
      if (!buffer) return 0;

      const dimensions = imageSize(buffer);
      return dimensions.width ?? 0;
    } catch {
      return 0;
    }
  }

  private async saveOne(file: Express.Multer.File): Promise<string> {
    return this.storage.uploadStatic(file, 'static');
  }

  private async deleteFile(publicPath?: string | null) {
    await this.storage.deleteByPublicPath(publicPath);
  }
}
