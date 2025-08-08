import { Module } from '@nestjs/common';
import { StartService } from './start.service';
import { StartUpdate } from './start.update';
import { GeneralModule } from '../general/general.module';
import { StartArgsService } from './args.service';
import { MenuModule } from 'src/menu/menu.module';

@Module({
  imports: [GeneralModule, MenuModule],
  providers: [StartService, StartUpdate, StartArgsService],
  exports: [StartService],
})
export class StartModule {}
