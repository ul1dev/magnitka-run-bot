import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Race, RaceCreationArgs } from '../models/race.model';
import { FindOptions } from 'sequelize';
import { getUId } from 'src/libs/common/database/assets/getUId';

@Injectable()
export class RaceRepository extends AbstractRepository<Race, RaceCreationArgs> {
  protected readonly logger = new Logger(Race.name);

  constructor(@InjectModel(Race) private raceModel: typeof Race) {
    super(raceModel);
  }

  async create(document: Omit<RaceCreationArgs, 'id'>): Promise<Race> {
    const created = await this.model.create({ ...document, id: getUId() });
    return created as Race;
  }

  async findById(id: string, options?: FindOptions<Race>) {
    return this.model.findByPk(id, options) as Promise<Race | null>;
  }

  async count(options?: FindOptions<Race>) {
    return this.model.count(options);
  }
}
