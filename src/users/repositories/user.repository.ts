import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserCreationArgs } from '../models/user.model';
import { FindOptions, FindOrCreateOptions } from 'sequelize';
import { getUId } from 'src/libs/common/database/assets/getUId';

@Injectable()
export class UserRepository extends AbstractRepository<User, UserCreationArgs> {
  protected readonly logger = new Logger(User.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super(userModel);
  }

  async create(document: Omit<UserCreationArgs, 'id'>): Promise<User> {
    const createdDocument = await this.model.create({
      ...document,
      id: getUId(),
      password: getUId(),
    });

    if (!document) {
      this.logger.warn('Document not created with Options', document);
      throw new NotFoundException('Document not created.');
    }

    return createdDocument as User;
  }

  async findOrCreate(options: FindOrCreateOptions<User, UserCreationArgs>) {
    const documents = await this.model.findOrCreate({
      ...options,
      defaults: {
        id: getUId(),
        password: getUId(),
        ...options?.defaults,
      },
    });

    return documents[0] as User;
  }

  async findByTgId(
    tgId: string | number,
    options?: Omit<FindOptions<User>, 'where'>,
  ) {
    const document = await this.userModel.findOne({
      where: {
        telegramId: tgId,
      },
      ...options,
    });

    return document as User;
  }

  async count(options?: FindOptions<User>): Promise<number> {
    return this.userModel.count(options);
  }
}
