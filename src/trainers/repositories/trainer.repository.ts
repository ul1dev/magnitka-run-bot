import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Trainer, TrainerCreationArgs } from '../models/trainer.model';
import { FindOptions } from 'sequelize';
import { getUId } from 'src/libs/common/database/assets/getUId';

@Injectable()
export class TrainerRepository extends AbstractRepository<
  Trainer,
  TrainerCreationArgs
> {
  protected readonly logger = new Logger(Trainer.name);

  constructor(@InjectModel(Trainer) private trainerModel: typeof Trainer) {
    super(trainerModel);
  }

  async create(document: Omit<TrainerCreationArgs, 'id'>): Promise<Trainer> {
    return (await this.model.create({ ...document, id: getUId() })) as Trainer;
  }

  async count(options?: FindOptions<Trainer>) {
    return this.model.count(options);
  }
}
