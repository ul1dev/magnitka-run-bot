import { Module } from '@nestjs/common';
import { MainOptions } from './models/main-options.model';
import { MainOptionsService } from './main-options.service';
import { MainOptionsController } from './main-options.controller';
import { DatabaseModule } from 'src/libs/common';
import { MainOptionsRepository } from './repositories/main-options.repository';

@Module({
  imports: [DatabaseModule.forFeature([MainOptions])],
  providers: [MainOptionsService, MainOptionsRepository],
  controllers: [MainOptionsController],
  exports: [MainOptionsService],
})
export class MainOptionsModule {}
