import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { TelegramModule } from './telegram/telegram.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from 'nestjs-pino';
import { ScheduleModule } from '@nestjs/schedule';
import { createNestLoggingModuleOptions } from './common/logger/logger.config';
import { ConfigModule } from '@nestjs/config';
import { Env, envConfigSchema } from './common/config/envConfig.schema';
import { validateEnvConfig } from './common/utils/validateEnvConfig';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config) => validateEnvConfig<Env>(envConfigSchema, config),
    }),
    CqrsModule.forRoot(),
    LoggerModule.forRoot(createNestLoggingModuleOptions()),
    ScheduleModule.forRoot(),

    CoreModule,
    TelegramModule,
    DatabaseModule,
  ],
})
export class AppModule {}
