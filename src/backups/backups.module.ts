import { Module } from '@nestjs/common';
import { BackupsService } from './backups.service';

@Module({
  providers: [BackupsService],
})
export class BackupsModule {}
