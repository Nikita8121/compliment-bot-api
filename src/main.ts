import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Env } from './common/config/envConfig.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService<Env>);
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(configService.getOrThrow('API_GLOBAL_PREFIX'));
  app.enableCors();

  app.flushLogs();

  await app.listen(configService.getOrThrow('APP_PORT'));
  app.enableShutdownHooks();
}
bootstrap();
