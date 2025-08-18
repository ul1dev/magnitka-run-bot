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
    for (const f of files || []) {
      const key = f.fieldname.replace(/\[\]$/, ''); // <-- сняли [] в конце
      (map[key] ||= []).push(f);
    }
    return map;
  }

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
    if (files.participantPackageImgs?.length) {
      draft.participantPackageImgs = await this.saveMany(
        files.participantPackageImgs,
      );
    }
    if (files.routesImgs?.length)
      draft.routesImgs = await this.saveMany(files.routesImgs);

    // ----- partners (создание) -----
    const incoming: any[] = Array.isArray((draft as any).partners)
      ? (draft as any).partners
      : [];
    if (incoming.length) {
      // соберём загруженные картинки по индексам partnerImg_<i>
      const savedByIndex = new Map<number, string>();
      await Promise.all(
        Object.keys(files)
          .filter((k) => /^partnerImg_\d+$/.test(k))
          .map(async (k) => {
            const i = Number(k.split('_')[1]);
            const f = files[k]?.[0];
            if (f) savedByIndex.set(i, await this.saveOne(f));
          }),
      );

      const result = incoming.map((p, i) => {
        const img = savedByIndex.get(i) ?? p.img; /* если вдруг прислали */
        const out = { categoryText: p.categoryText, link: p.link } as any;
        if (img) out.img = img;
        return out;
      });
      (draft as any).partners = result;
    }
  }

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

    // ---------- Партнёры (точечные изменения) ----------
    // Если не пришла meta partners — ничего с партнёрами не делаем
    const incoming = Array.isArray((draft as any).partners)
      ? ((draft as any).partners as any[])
      : null;
    if (!incoming) return;

    const oldPartners: any[] = Array.isArray(existed.partners)
      ? existed.partners
      : [];

    // 1) Сохранить новые картинки по полям partnerImg_<index>
    const savedByIndex = new Map<number, string>();
    await Promise.all(
      Object.keys(files)
        .filter((k) => /^partnerImg_\d+$/.test(k))
        .map(async (k) => {
          const i = Number(k.split('_')[1]);
          const f = files[k]?.[0];
          if (f) savedByIndex.set(i, await this.saveOne(f));
        }),
    );

    // 2) Узнать какие старые индексы остались, чтобы понять кого удалили
    const keptOldIdx = new Set<number>();
    for (const row of incoming) {
      const oi = Number.isInteger(row?.origIndex)
        ? Number(row.origIndex)
        : null;
      if (oi !== null && oi >= 0) keptOldIdx.add(oi);
    }

    // 3) Удалить изображения только у тех, кто реально удалён (их origIndex нет в новом списке)
    for (let oi = 0; oi < oldPartners.length; oi++) {
      if (!keptOldIdx.has(oi)) {
        const oldImg = oldPartners[oi]?.img;
        await this.deleteFieldFiles(oldImg);
      }
    }

    // 4) Собрать конечный массив партнёров
    const newPartners = await Promise.all(
      incoming.map(async (p, i) => {
        const oi = Number.isInteger(p?.origIndex) ? Number(p.origIndex) : null;

        // если пришёл новый файл для этого i — заменяем картинку
        if (savedByIndex.has(i)) {
          const newImg = savedByIndex.get(i)!;
          // Если у старого была картинка и мы её заменяем — удалить старую
          if (oi !== null && oldPartners[oi]?.img) {
            await this.deleteFieldFiles(oldPartners[oi].img);
          }
          return { categoryText: p.categoryText, link: p.link, img: newImg };
        }

        // иначе, если клиент прислал img в meta — оставляем её как есть
        if (p?.img) {
          return { categoryText: p.categoryText, link: p.link, img: p.img };
        }

        // иначе, если это существующая запись (origIndex есть) — перенесём старую картинку
        if (oi !== null && oldPartners[oi]?.img) {
          return {
            categoryText: p.categoryText,
            link: p.link,
            img: oldPartners[oi].img,
          };
        }

        // новый партнёр без картинки
        return { categoryText: p.categoryText, link: p.link };
      }),
    );

    (draft as any).partners = newPartners;
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

    let pathOnly = publicPath;
    try {
      // если дали абсолютный URL — возьмём pathname
      const u = new URL(publicPath);
      pathOnly = u.pathname || publicPath;
    } catch {
      // not an absolute URL — ok
    }

    const m = pathOnly.match(/^\/?static\/(.+)$/i);
    if (!m) return undefined;

    const filename = m[1];
    return path.join(process.cwd(), 'static', filename);
  }
}
