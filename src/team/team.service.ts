import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { S3StorageService } from 'src/libs/common';
import { TeamMemberRepository } from './repositories/team-member.repository';
import { TeamMember, TeamMemberCreationArgs } from './models/team-member.model';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';

type FilesMap = Record<string, Express.Multer.File[]>;

@Injectable()
export class TeamMembersService {
  constructor(
    private readonly repo: TeamMemberRepository,
    private readonly storage: S3StorageService,
  ) {}

  // публично
  findAll() {
    return this.repo.findAll({ order: [['createdAt', 'ASC']] });
  }

  // публично
  async findById(id: string) {
    const doc = await this.repo.findByPk(id);
    if (!doc) throw new NotFoundException('Team member not found');
    return doc;
  }

  async create(dto: CreateTeamMemberDto, files: Express.Multer.File[]) {
    const map = this.groupFiles(files);

    if (!map.img?.[0]) {
      throw new BadRequestException('Фото обязательно');
    }

    const img = await this.saveOne(map.img[0]);

    const payload: TeamMemberCreationArgs = {
      name: dto.name,
      description: dto.description,
      img, // обязателен по типу
    };

    return this.repo.create(payload);
  }

  // защищено
  async update(
    id: string,
    dto: UpdateTeamMemberDto,
    files: Express.Multer.File[],
  ) {
    const entity = await this.findById(id);
    const map = this.groupFiles(files);

    let img = entity.img;

    if (map.img?.[0]) {
      await this.deleteFile(entity.img);
      img = await this.saveOne(map.img[0]);
    }

    if (!img) {
      // если всё ещё нет фото — ошибка (поле обязательно)
      throw new BadRequestException('Фото обязательно');
    }

    await entity.update({ ...dto, img });
    return entity;
  }

  // защищено
  async remove(id: string) {
    const entity = await this.findById(id);
    await this.deleteFile(entity.img);
    await entity.destroy();
    return { ok: true };
  }

  // ---------- helpers ----------

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
