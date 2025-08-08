import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pacemaker, PacemakerCreationArgs } from '../models/pacemaker.model';
import { FindOptions } from 'sequelize';
import { getUId } from 'src/libs/common/database/assets/getUId';

@Injectable()
export class PacemakerRepository extends AbstractRepository<
  Pacemaker,
  PacemakerCreationArgs
> {
  protected readonly logger = new Logger(Pacemaker.name);

  constructor(
    @InjectModel(Pacemaker) private pacemakerModel: typeof Pacemaker,
  ) {
    super(pacemakerModel);
  }

  async create(
    document: Omit<PacemakerCreationArgs, 'id'>,
  ): Promise<Pacemaker> {
    return (await this.model.create({
      ...document,
      id: getUId(),
    })) as Pacemaker;
  }

  async count(options?: FindOptions<Pacemaker>) {
    return this.model.count(options);
  }
}
