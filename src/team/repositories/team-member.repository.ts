import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  TeamMember,
  TeamMemberCreationArgs,
} from '../models/team-member.model';

@Injectable()
export class TeamMemberRepository extends AbstractRepository<
  TeamMember,
  TeamMemberCreationArgs
> {
  protected readonly logger = new Logger(TeamMember.name);

  constructor(
    @InjectModel(TeamMember) private teamMemberModel: typeof TeamMember,
  ) {
    super(teamMemberModel);
  }
}
