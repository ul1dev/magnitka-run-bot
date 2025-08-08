import { Module } from '@nestjs/common';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { StartModule } from './start/start.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeneralModule } from './general/general.module';
import { validationSchema } from './libs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './general/database/database.module';
import { ListenersModule } from './libs/listeners/listeners.module';
import { ListenersLowModule } from './libs/listeners/listeners-low.module';
import { BansModule } from './bans/bans.module';
import { ChainModule } from './libs/chain/chain.module';
import { RolesModule } from './roles/roles.module';
import { MailingsModule } from './mailings/mailings.module';
import { PaginationModule } from './libs/pagination/pagination.module';
import { FilesModule } from './files/files.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupsModule } from './backups/backups.module';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './general/guards';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { CustomCacheModule } from './cache/cache.module';
import { MenuModule } from './menu/menu.module';
import { AppController } from './app.controller';
import { RacesModule } from './races/reces.module';
import { TrainersModule } from './trainers/trainers.module';
import { PacemakersModule } from './pacemakers/pacemakers.module';
import { ShopModule } from './shop/shop.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      envFilePath: [`.${process.env.NODE_ENV}.env`, `.env.stage.dev`],
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      useFactory: async (
        configService: ConfigService,
      ): Promise<TelegrafModuleOptions> => {
        const token = configService.get<string>('BOT_TOKEN');
        if (!token) {
          throw new Error('BOT_TOKEN must be defined in environment');
        }
        return { token };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 10,
      },
    ]),
    CacheModule.register({
      ttl: 70 * 1000,
      max: 1000,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    StartModule,
    GeneralModule,
    UsersModule,
    PaginationModule,
    ListenersModule,
    BansModule,
    ChainModule,
    RolesModule,
    MailingsModule,
    FilesModule,
    BackupsModule,
    CustomCacheModule,
    MenuModule,
    RacesModule,
    TrainersModule,
    PacemakersModule,
    ShopModule,
    OrdersModule,

    // должно быть внизу из за приоритета выполнения
    ListenersLowModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
