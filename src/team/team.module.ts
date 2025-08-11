import { Module } from '@nestjs/common';
import { TeamMembersController } from './team.controller';
import { TeamMembersService } from './team.service';
import { TeamMember } from './models/team-member.model';
import { TeamMemberRepository } from './repositories/team-member.repository';
import { DatabaseModule } from 'src/libs/common';

@Module({
  imports: [DatabaseModule.forFeature([TeamMember])],
  controllers: [TeamMembersController],
  providers: [TeamMembersService, TeamMemberRepository],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}
