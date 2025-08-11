import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  MainOptions,
  MainOptionsCreationArgs,
} from '../models/main-options.model';

@Injectable()
export class MainOptionsRepository extends AbstractRepository<
  MainOptions,
  MainOptionsCreationArgs
> {
  protected readonly logger = new Logger(MainOptions.name);

  constructor(
    @InjectModel(MainOptions) private mainOptionsModel: typeof MainOptions,
  ) {
    super(mainOptionsModel);
  }
}
