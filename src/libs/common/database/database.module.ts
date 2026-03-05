import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

@Module({})
export class DatabaseModule {
  static forRoot(models: any[]) {
    return SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DBNAME'),
        pool: {
          max: 50,
          min: 0,
          idle: 10000,
        },
        models,
      }),
      inject: [ConfigService],
    });
  }
  static forFeature(models: any[]) {
    return SequelizeModule.forFeature(models);
  }
}
