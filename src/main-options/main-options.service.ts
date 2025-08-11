import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MainOptions } from './models/main-options.model';
import { CreateMainOptionsDto } from './dto/create-main-options.dto';
import { UpdateMainOptionsDto } from './dto/update-main-options.dto';
import { MainOptionsRepository } from './repositories/main-options.repository';

@Injectable()
export class MainOptionsService {
  constructor(private readonly mainOptionsRepository: MainOptionsRepository) {}

  /** Вернёт первую (и единственную) запись или null */
  private async getSingleton(): Promise<MainOptions | null> {
    return this.mainOptionsRepository.findOne({});
  }

  /** Создать запись, если ещё не создана */
  async create(dto: CreateMainOptionsDto) {
    const existed = await this.getSingleton();
    if (existed) {
      throw new ConflictException(
        'MainOptions уже создан. Используйте PATCH для изменения.',
      );
    }
    return this.mainOptionsRepository.create({ regLink: dto.regLink });
  }

  /** Обновить (или создать, если ещё нет) */
  async update(dto: UpdateMainOptionsDto) {
    const existed = await this.getSingleton();
    if (!existed) {
      // допускаем upsert, чтобы первой операцией мог быть PATCH
      return this.mainOptionsRepository.create({ regLink: dto.regLink });
    }
    await existed.update({ regLink: dto.regLink });
    return existed;
  }

  /** (опционально) получить текущие настройки — если вдруг пригодится на клиенте */
  async get() {
    const existed = await this.getSingleton();
    if (!existed) throw new NotFoundException('MainOptions не найден');
    return existed;
  }
}
