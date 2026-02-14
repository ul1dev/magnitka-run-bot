import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MainPage, MainPageCreationArgs } from '../models/main-page.model';

@Injectable()
export class MainPageRepository extends AbstractRepository<
  MainPage,
  MainPageCreationArgs
> {
  protected readonly logger = new Logger(MainPage.name);

  constructor(
    @InjectModel(MainPage) private mainPageModel: typeof MainPage,
  ) {
    super(mainPageModel);
  }
}
