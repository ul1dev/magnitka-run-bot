import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/libs/common';
import { User } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { RolesModule } from 'src/roles/roles.module';
import { CustomCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [DatabaseModule.forFeature([User]), RolesModule, CustomCacheModule],
  providers: [UsersService, UserRepository],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}
