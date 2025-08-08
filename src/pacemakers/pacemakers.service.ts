import { Injectable, NotFoundException } from '@nestjs/common';
import { PacemakerRepository } from './repositories/pacemaker.repository';

@Injectable()
export class PacemakersService {
  constructor(private readonly pacemakerRepository: PacemakerRepository) {}

  findAll() {
    return this.pacemakerRepository.findAll({ order: [['createdAt', 'ASC']] });
  }

  async findById(id: string) {
    const doc = await this.pacemakerRepository.findByPk(id);
    if (!doc) throw new NotFoundException('Pacemaker not found');
    return doc;
  }
}
