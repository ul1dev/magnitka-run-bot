import { Injectable, NotFoundException } from '@nestjs/common';
import { RaceRepository } from './repositories/race.repository';
import { Race } from './models/race.model';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

type FilesMap = Record<string, Express.Multer.File[]>;

@Injectable()
export class RacesService {
  constructor(private readonly raceRepository: RaceRepository) {}

  findAll() {
    return this.raceRepository.findAll({ order: [['createdAt', 'ASC']] });
  }

  async findById(id: string) {
    const race = await this.raceRepository.findByPk(id);
    if (!race) throw new NotFoundException('Race not found');
    return race;
  }

  async create(data: Partial<Race>, files: Express.Multer.File[]) {
    const filesMap = this.groupFiles(files);
    await this.applyUploadedImagesCreate(data, filesMap);
    return this.raceRepository.create(data as any);
  }

  async update(id: string, data: Partial<Race>, files: Express.Multer.File[]) {
    const entity = await this.findById(id);
    const filesMap = this.groupFiles(files);
    await this.applyUploadedImagesUpdate(data, filesMap, entity); // полная замена + удаление старых
    await entity.update({ ...data });
    return entity;
  }

  async remove(id: string) {
    const entity = await this.findById(id);

    // опционально: удалить и файлы картинок при удалении сущности
    await this.deleteFieldFiles(entity.cardBgImg);
    await this.deleteFieldFiles(entity.mainBgImg);
    await this.deleteFieldFiles(entity.aboutImgs);
    await this.deleteFieldFiles(entity.participantPackageImgs);
    await this.deleteFieldFiles(entity.routesImgs);
    if (Array.isArray(entity.partners)) {
      await this.deleteFieldFiles(
        entity.partners.map((p: any) => p?.img).filter(Boolean),
      );
    }

    await entity.destroy();
    return { ok: true };
  }

  // ---------- helpers ----------

  private groupFiles(files: Express.Multer.File[]): FilesMap {
    const map: FilesMap = {};
    for (const f of files || []) (map[f.fieldname] ||= []).push(f);
    return map;
  }

  /** CREATE: берём только пришедшие файлы, ничего не удаляем. */
  private async applyUploadedImagesCreate(
    draft: Partial<Race>,
    files: FilesMap,
  ) {
    if (files.cardBgImg?.[0])
      draft.cardBgImg = await this.saveOne(files.cardBgImg[0]);
    if (files.mainBgImg?.[0])
      draft.mainBgImg = await this.saveOne(files.mainBgImg[0]);

    if (files.aboutImgs?.length)
      draft.aboutImgs = await this.saveMany(files.aboutImgs);
    if (files.participantPackageImgs?.length)
      draft.participantPackageImgs = await this.saveMany(
        files.participantPackageImgs,
      );
    if (files.routesImgs?.length)
      draft.routesImgs = await this.saveMany(files.routesImgs);

    // partners: берём meta из body (draft.partners) и подставляем img из файлов по индексу
    if (files.partnersImgs?.length && Array.isArray((draft as any).partners)) {
      const imgs = await this.saveMany(files.partnersImgs);
      const partners = (draft as any).partners.map((p: any, i: number) => ({
        ...p,
        img: imgs[i] ?? p.img,
      }));
      (draft as any).partners = partners;
    }
  }

  /** UPDATE: если пришли файлы по полю — ПОЛНОСТЬЮ ЗАМЕНЯЕМ это поле и УДАЛЯЕМ старые файлы. */
  private async applyUploadedImagesUpdate(
    draft: Partial<Race>,
    files: FilesMap,
    existed: Race,
  ) {
    // одиночные
    if (files.cardBgImg?.[0]) {
      await this.deleteFieldFiles(existed.cardBgImg);
      draft.cardBgImg = await this.saveOne(files.cardBgImg[0]);
    }
    if (files.mainBgImg?.[0]) {
      await this.deleteFieldFiles(existed.mainBgImg);
      draft.mainBgImg = await this.saveOne(files.mainBgImg[0]);
    }

    // массивы
    if (files.aboutImgs?.length) {
      await this.deleteFieldFiles(existed.aboutImgs);
      draft.aboutImgs = await this.saveMany(files.aboutImgs);
    }
    if (files.participantPackageImgs?.length) {
      await this.deleteFieldFiles(existed.participantPackageImgs);
      draft.participantPackageImgs = await this.saveMany(
        files.participantPackageImgs,
      );
    }
    if (files.routesImgs?.length) {
      await this.deleteFieldFiles(existed.routesImgs);
      draft.routesImgs = await this.saveMany(files.routesImgs);
    }

    // партнёры: если пришли новые картинки или обновили partners meta — заменить картинки
    if (files.partnersImgs?.length || Array.isArray((draft as any).partners)) {
      // удалить ВСЕ старые картинки партнёров
      if (Array.isArray(existed.partners)) {
        const oldImgs = existed.partners
          .map((p: any) => p?.img)
          .filter(Boolean);
        await this.deleteFieldFiles(oldImgs);
      }
      const newImgs = files.partnersImgs?.length
        ? await this.saveMany(files.partnersImgs)
        : [];

      // новая meta берётся из draft.partners если есть, иначе из существующих (но без старых img)
      const basePartners: any[] = Array.isArray((draft as any).partners)
        ? (draft as any).partners
        : Array.isArray(existed.partners)
          ? existed.partners.map(({ img, ...rest }: any) => rest)
          : [];

      const replaced = basePartners
        .map((p, i) => ({ ...p, img: newImgs[i] ?? null }))
        .map((p) => {
          // если для какого-то партнёра не прислали новую картинку — img будет null
          // можно оставить null/undefined, или удалить поле:
          if (!p.img) delete p.img;
          return p;
        });

      (draft as any).partners = replaced;
    }
  }

  private async saveOne(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.bin';
    const filename = `${randomUUID()}${ext}`;
    const staticDir = path.resolve(process.cwd(), 'static');
    await fs.promises.mkdir(staticDir, { recursive: true });

    const fullPath = path.join(staticDir, filename);
    const data =
      file.buffer ??
      (file.path ? await fs.promises.readFile(file.path) : undefined);
    if (!data) throw new Error('Uploaded file has no data buffer');

    await fs.promises.writeFile(fullPath, data);
    return `/static/${filename}`;
  }

  private async saveMany(files: Express.Multer.File[]): Promise<string[]> {
    const out: string[] = [];
    for (const f of files) out.push(await this.saveOne(f));
    return out;
  }

  private async deleteFieldFiles(value?: string | string[]) {
    const list = Array.isArray(value) ? value : value ? [value] : [];
    await Promise.all(
      list.map(async (p) => {
        try {
          const abs = this.publicToAbsolute(p);
          if (!abs) return;
          await fs.promises.unlink(abs).catch(() => {});
        } catch {}
      }),
    );
  }

  private publicToAbsolute(publicPath?: string) {
    if (!publicPath) return undefined;
    // ожидаем формат '/static/<name>'
    const m = publicPath.match(/^\/?static\/(.+)$/i);
    if (!m) return undefined;
    const filename = m[1];
    return path.join(process.cwd(), 'static', filename);
  }
}
