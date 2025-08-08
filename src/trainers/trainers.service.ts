import { Injectable, NotFoundException } from '@nestjs/common';
import { TrainerRepository } from './repositories/trainer.repository';

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
}
