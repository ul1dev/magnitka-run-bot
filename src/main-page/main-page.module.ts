import { Module } from '@nestjs/common';
import { MainPage } from './models/main-page.model';
import { MainPageService } from './main-page.service';
import { MainPageController } from './main-page.controller';
import { DatabaseModule } from 'src/libs/common';
import { MainPageRepository } from './repositories/main-page.repository';

@Module({
  imports: [DatabaseModule.forFeature([MainPage])],
  providers: [MainPageService, MainPageRepository],
  controllers: [MainPageController],
  exports: [MainPageService],
})
export class MainPageModule {}
