import { Module } from '@nestjs/common';
import { DatabaseModule as AppDatabaseModule } from 'src/libs/common';
import { Race } from 'src/races/models/race.model';
import { Trainer } from 'src/trainers/models/trainer.model';
import { Pacemaker } from 'src/pacemakers/models/pacemaker.model';
import { ShopProduct } from 'src/shop/models/shop-product.model';
import { Order } from 'src/orders/models/order.model';
import { OrderProduct } from 'src/orders/models/order-product.model';
import { TeamMember } from 'src/team/models/team-member.model';
import { MainOptions } from 'src/main-options/models/main-options.model';
import { MainPage } from 'src/main-page/models/main-page.model';

@Module({
  imports: [
    AppDatabaseModule.forRoot([
      Race,
      Trainer,
      Pacemaker,
      ShopProduct,
      Order,
      OrderProduct,
      TeamMember,
      MainOptions,
      MainPage,
    ]),
  ],
})
export class DatabaseModule {}
