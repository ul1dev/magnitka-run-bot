import { Injectable, NotFoundException } from '@nestjs/common';
import { RaceRepository } from './repositories/race.repository';

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
}
