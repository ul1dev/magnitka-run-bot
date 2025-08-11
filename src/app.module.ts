import { Module } from '@nestjs/common';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { validationSchema } from './libs/common';
import { DatabaseModule } from './general/database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupsModule } from './backups/backups.module';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './general/guards';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { CustomCacheModule } from './cache/cache.module';
import { AppController } from './app.controller';
import { RacesModule } from './races/reces.module';
import { TrainersModule } from './trainers/trainers.module';
import { PacemakersModule } from './pacemakers/pacemakers.module';
import { ShopModule } from './shop/shop.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { TrainingSignupsModule } from './trainings/training-signups.module';
import { TeamMembersModule } from './team/team.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'static'),
      serveRoot: '/static',
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    BackupsModule,
    CustomCacheModule,
    RacesModule,
    TrainersModule,
    PacemakersModule,
    ShopModule,
    OrdersModule,
    PaymentsModule,
    TrainingSignupsModule,
    TeamMembersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
